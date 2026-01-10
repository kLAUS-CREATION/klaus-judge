package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/klaus-creations/klaus-judge/api/internal/dto"
	"github.com/klaus-creations/klaus-judge/api/internal/services"
)

// AuthHandler handles HTTP requests for authentication and user operations.
type AuthHandler struct {
	authService *services.AuthService
}

// NewAuthHandler creates a new auth handler.
func NewAuthHandler(authService *services.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

// Register handles user registration.
func (h *AuthHandler) Register(c *gin.Context) {
	var req dto.SignUpRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.authService.Register(&req)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, dto.UserResponse{
		ID:        user.ID,
		FullName:  user.FullName,
		Email:     user.Email,
		Username:  user.Username,
		Role:      user.Role,
		Verified:  user.Verified,
		CreatedAt: user.CreatedAt,
	})
}

// Login handles user login.
func (h *AuthHandler) Login(c *gin.Context) {
	var req dto.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tokens, user, err := h.authService.Login(&req)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"tokens": tokens,
		"user": dto.UserResponse{
			ID:        user.ID,
			FullName:  user.FullName,
			Email:     user.Email,
			Username:  user.Username,
			Role:      user.Role,
			Verified:  user.Verified,
			CreatedAt: user.CreatedAt,
		},
	})
}

// RefreshToken handles token refresh.
func (h *AuthHandler) RefreshToken(c *gin.Context) {
	var req dto.RefreshTokenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tokens, err := h.authService.RefreshToken(req.RefreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, tokens)
}

// Logout handles user logout (client-side token discard).
func (h *AuthHandler) Logout(c *gin.Context) {
	if err := h.authService.Logout(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "logged out successfully"})
}

// GetProfile retrieves the current user's profile.
func (h *AuthHandler) GetProfile(c *gin.Context) {
	userID := h.getUserIDFromContext(c)
	if userID == uuid.Nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	profile, err := h.authService.GetProfile(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, profile)
}

// UpdateProfile updates the current user's profile.
func (h *AuthHandler) UpdateProfile(c *gin.Context) {
	userID := h.getUserIDFromContext(c)
	if userID == uuid.Nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var req dto.UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updated, err := h.authService.UpdateProfile(userID, &req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, updated)
}

// GetStats retrieves the current user's stats.
func (h *AuthHandler) GetStats(c *gin.Context) {
	userID := h.getUserIDFromContext(c)
	if userID == uuid.Nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	stats, err := h.authService.GetStats(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, stats)
}

// getUserIDFromContext extracts user ID from Gin context (assuming set by middleware).
func (h *AuthHandler) getUserIDFromContext(c *gin.Context) uuid.UUID {
	userID, exists := c.Get("user_id")
	if !exists {
		return uuid.Nil
	}
	return userID.(uuid.UUID)
}
