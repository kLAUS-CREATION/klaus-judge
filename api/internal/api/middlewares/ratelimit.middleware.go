package middlewares

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	"github.com/ulule/limiter/v3"
	mgin "github.com/ulule/limiter/v3/drivers/middleware/gin"
	libredis "github.com/ulule/limiter/v3/drivers/store/redis"
)

// NewRateLimiterMiddleware creates a new rate limiter middleware.
func NewRateLimiterMiddleware(client *redis.Client, rate limiter.Rate, keyPrefix string) gin.HandlerFunc {
	// 1. Create a store with the redis client.
	store, err := libredis.NewStoreWithOptions(client, limiter.StoreOptions{
		Prefix: keyPrefix,
	})
	if err != nil {
		fmt.Printf("Failed to create limiter store: %v\n", err)
		return func(c *gin.Context) { c.Next() } // Fail open
	}

	// 2. Create the limiter instance.
	instance := limiter.New(store, rate)

	// 3. Create the middleware using the library's Gin driver
	// By default, this uses ClientIP as the key.
	return mgin.NewMiddleware(instance)
}

// NewUserRateLimiterMiddleware creates a rate limiter based on Authenticated User ID.
func NewUserRateLimiterMiddleware(client *redis.Client, rate limiter.Rate, keyPrefix string) gin.HandlerFunc {
	store, err := libredis.NewStoreWithOptions(client, limiter.StoreOptions{
		Prefix: keyPrefix,
	})
	if err != nil {
		fmt.Printf("Failed to create user limiter store: %v\n", err)
		return func(c *gin.Context) { c.Next() }
	}

	instance := limiter.New(store, rate)

	// Custom KeyGetter for User ID
	keyGetter := func(c *gin.Context) string {
		userID, exists := c.Get("user_id")
		if !exists {
			return c.ClientIP() // Fallback to IP if not authenticated
		}
		return fmt.Sprintf("%v", userID)
	}

	return func(c *gin.Context) {
		key := keyGetter(c)
		context, err := instance.Get(c, key)
		if err != nil {
			fmt.Printf("Rate limit error: %v\n", err)
			c.Next()
			return
		}

		c.Header("X-RateLimit-Limit", strconv.FormatInt(context.Limit, 10))
		c.Header("X-RateLimit-Remaining", strconv.FormatInt(context.Remaining, 10))
		c.Header("X-RateLimit-Reset", strconv.FormatInt(context.Reset, 10))

		if context.Reached {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error": "Too many requests. Please try again later.",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

// Helper to define rates easily
func Rate(limit int64, period time.Duration) limiter.Rate {
	return limiter.Rate{
		Period: period,
		Limit:  limit,
	}
}
