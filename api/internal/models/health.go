package models

type HealthResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
	Uptime  string `json:"uptime"`
}
