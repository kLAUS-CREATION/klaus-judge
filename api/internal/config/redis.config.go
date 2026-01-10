package config

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
)

var (
	RedisClient *redis.Client
	ctx         = context.Background()
)

// ConnectRedis establishes a connection to Redis with production-ready settings
func ConnectRedis() (*redis.Client, error) {
	host := GetEnv("REDIS_HOST", "redis")
	port := GetEnvInt("REDIS_PORT", 6379)
	password := GetEnv("REDIS_PASSWORD", "")

	if password == "" {
		return nil, errors.New("missing required Redis environment variables")
	}

	// Redis Client
	client := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%d", host, port),
		Password: password,
		DB:       0, // use default DB

		// Connection pool settings
		PoolSize:     10,              // number of socket connections
		MinIdleConns: 5,               // minimum idle connections
		MaxRetries:   3,               // retry failed commands
		DialTimeout:  5 * time.Second, // timeout for establishing connection
		ReadTimeout:  3 * time.Second, // timeout for socket reads
		WriteTimeout: 3 * time.Second, // timeout for socket writes

		// Keep connection alive
		PoolTimeout:     4 * time.Second,
		ConnMaxIdleTime: 5 * time.Minute,
		MaxIdleConns:    10,
	})

	// Test connection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := client.Ping(ctx).Err(); err != nil {
		return nil, fmt.Errorf("failed to connect to Redis: %w", err)
	}

	RedisClient = client
	return client, nil
}

// Close Redis connection
func CloseRedis() error {
	if RedisClient != nil {
		return RedisClient.Close()
	}
	return nil
}

// PushSubmissionJob adds a submission ID to the judge queue
func PushSubmissionJob(submissionID uuid.UUID) error {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	// LPUSH adds to the left (head) of the list
	return RedisClient.LPush(ctx, "judge_queue", submissionID.String()).Err()
}

// PopSubmissionJob retrieves a submission ID from the queue (blocking)
// This is used by the worker - blocks until a job is available
func PopSubmissionJob(timeout time.Duration) (uuid.UUID, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	// BRPOP blocks until an item is available or timeout
	result, err := RedisClient.BRPop(ctx, timeout, "judge_queue").Result()
	if err != nil {
		return uuid.Nil, err
	}

	// result[0] is the key name, result[1] is the value
	if len(result) < 2 {
		return uuid.Nil, fmt.Errorf("invalid queue response")
	}

	return uuid.Parse(result[1])
}

// GetQueueLength returns the number of pending jobs
func GetQueueLength() (int64, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()

	return RedisClient.LLen(ctx, "judge_queue").Result()
}

// ClearQueue removes all jobs from the queue (use with caution!)
func ClearQueue() error {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	return RedisClient.Del(ctx, "judge_queue").Err()
}

// Caching helper functions (bonus - for later optimization)

// SetCache stores a value with expiration
func SetCache(key string, value interface{}, expiration time.Duration) error {
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()

	return RedisClient.Set(ctx, key, value, expiration).Err()
}

// GetCache retrieves a cached value
func GetCache(key string) (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()

	return RedisClient.Get(ctx, key).Result()
}

// DeleteCache removes a cached value
func DeleteCache(key string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()

	return RedisClient.Del(ctx, key).Err()
}
