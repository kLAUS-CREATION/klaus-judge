package repository

type HealthRepository struct{}

func NewHealthRepository() *HealthRepository {
	return &HealthRepository{}
}

func (r *HealthRepository) MockDatabaseCheck() string {
	return "Database connection is healthy"
}
