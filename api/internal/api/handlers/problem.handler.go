package handlers

import (
	"net/http"
	"strconv"
	"github.com/gin-gonic/gin"
	"github.com/klaus-creations/klaus-judge/api/internal/dto"
	"github.com/klaus-creations/klaus-judge/api/internal/services"
)

// ProblemHandler handles HTTP requests for problems.
type ProblemHandler struct {
	problemService *services.ProblemService
}

// NewProblemHandler creates a new problem handler.
func NewProblemHandler(problemService *services.ProblemService) *ProblemHandler {
	return &ProblemHandler{problemService: problemService}
}

// CreateProblem handles problem creation.
func (h *ProblemHandler) CreateProblem(c *gin.Context) {
	userID := h.getUserIDFromContext(c)
	if userID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var req dto.CreateProblemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	problem, err := h.problemService.CreateProblem(&req, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, dto.ProblemResponseFromDomain(problem))
}

// GetProblem handles getting a problem.
func (h *ProblemHandler) GetProblem(c *gin.Context) {
	slug := c.Param("slug")
	role, _ := c.Get("role")
	includeHidden := role == "admin"

	resp, err := h.problemService.GetProblem(slug, includeHidden)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "problem not found"})
		return
	}

	c.JSON(http.StatusOK, resp)
}

// ListProblems handles listing problems.
func (h *ProblemHandler) ListProblems(c *gin.Context) {
	pagination := dto.ParsePagination(c)
	filters := dto.ParseProblemFilters(c)

	resp, err := h.problemService.ListProblems(pagination, filters)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resp)
}

// UpdateProblem handles updating a problem.
func (h *ProblemHandler) UpdateProblem(c *gin.Context) {
	slug := c.Param("slug")

	var req dto.UpdateProblemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	problem, err := h.problemService.UpdateProblem(slug, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, dto.ProblemResponseFromDomain(problem))
}

// DeleteProblem handles deleting a problem.
func (h *ProblemHandler) DeleteProblem(c *gin.Context) {
	slug := c.Param("slug")

	if err := h.problemService.DeleteProblem(slug); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "problem deleted"})
}

// AddTestCase handles adding a test case.
func (h *ProblemHandler) AddTestCase(c *gin.Context) {
	slug := c.Param("slug")

	var req dto.TestCaseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	testCase, err := h.problemService.AddTestCase(slug, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, testCase)
}

// UpdateTestCase handles updating a test case.
func (h *ProblemHandler) UpdateTestCase(c *gin.Context) {
	idStr := c.Param("id")
	id, _ := strconv.ParseUint(idStr, 10, 32)

	var req dto.TestCaseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	testCase, err := h.problemService.UpdateTestCase(uint(id), &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, testCase)
}

// DeleteTestCase handles deleting a test case.
func (h *ProblemHandler) DeleteTestCase(c *gin.Context) {
	idStr := c.Param("id")
	id, _ := strconv.ParseUint(idStr, 10, 32)

	if err := h.problemService.DeleteTestCase(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "test case deleted"})
}

// getUserIDFromContext extracts user ID from context (same as auth).
func (h *ProblemHandler) getUserIDFromContext(c *gin.Context) uint {
	uid, exists := c.Get("user_id")
	if !exists {
		return 0
	}

	userID, ok := uid.(uint)
	if !ok {
		return 0
	}

	return userID
}

