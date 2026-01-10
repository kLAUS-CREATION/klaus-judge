package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/klaus-creations/klaus-judge/api/internal/dto"
	"github.com/klaus-creations/klaus-judge/api/internal/services"
)

// SubmissionHandler handles HTTP requests for submissions.
type SubmissionHandler struct {
	submissionService *services.SubmissionService
}

// NewSubmissionHandler creates a new submission handler.
func NewSubmissionHandler(submissionService *services.SubmissionService) *SubmissionHandler {
	return &SubmissionHandler{submissionService: submissionService}
}

// SubmitSolution handles code submission.
func (h *SubmissionHandler) SubmitSolution(c *gin.Context) {
	userID := h.getUserIDFromContext(c)
	if userID == uuid.Nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var req dto.SubmitRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ip := c.ClientIP()

	submission, err := h.submissionService.SubmitSolution(&req, userID, ip)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"id":      submission.ID,
		"verdict": submission.Verdict,
		"message": "submission queued for judging",
	})
}

// GetSubmission handles getting a submission.
func (h *SubmissionHandler) GetSubmission(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid submission id"})
		return
	}

	userID := h.getUserIDFromContext(c)
	role, _ := c.Get("role")
	isAdmin := role == "admin"

	resp, err := h.submissionService.GetSubmission(id, userID, isAdmin)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resp)
}

// ListMySubmissions handles listing user's submissions.
func (h *SubmissionHandler) ListMySubmissions(c *gin.Context) {
	userID := h.getUserIDFromContext(c)
	if userID == uuid.Nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	pagination := dto.ParsePagination(c)

	resp, err := h.submissionService.ListMySubmissions(userID, pagination)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resp)
}

// ListAllSubmissions handles listing all submissions (admin).
func (h *SubmissionHandler) ListAllSubmissions(c *gin.Context) {
	pagination := dto.ParsePagination(c)
	filters := dto.ParseSubmissionFilters(c)

	resp, err := h.submissionService.ListAllSubmissions(pagination, filters)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resp)
}

// getUserIDFromContext same as above.
func (h *SubmissionHandler) getUserIDFromContext(c *gin.Context) uuid.UUID {
	uid, exists := c.Get("user_id")
	if !exists {
		return uuid.Nil
	}

	userID, ok := uid.(uuid.UUID)
	if !ok {
		return uuid.Nil
	}

	return userID
}
