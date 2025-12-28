package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/klaus-creations/klaus-judge/api/internal/services"
	"net/http"
)

type HealthHandler struct {
	service *services.HealthService
}

func NewHealthHandler(service *services.HealthService) *HealthHandler {
	return &HealthHandler{service: service}
}

func (h *HealthHandler) Ping(c *gin.Context) {
	response := h.service.GetSystemStatus()
	c.JSON(http.StatusOK, response)
}
