package services

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/klaus-creations/klaus-judge/api/internal/config"
	"github.com/klaus-creations/klaus-judge/api/internal/domain"
	"github.com/klaus-creations/klaus-judge/api/internal/dto"
	"github.com/klaus-creations/klaus-judge/api/internal/repository"
)

// SubmissionService handles submission-related business logic.
type SubmissionService struct {
	submissionRepo     repository.SubmissionRepository
	testCaseResultRepo repository.TestCaseResultRepository
	problemRepo        repository.ProblemRepository
	userRepo           repository.UserRepository
}

// NewSubmissionService creates a new submission service.
func NewSubmissionService(
	submissionRepo repository.SubmissionRepository,
	testCaseResultRepo repository.TestCaseResultRepository,
	problemRepo repository.ProblemRepository,
	userRepo repository.UserRepository,
) *SubmissionService {
	return &SubmissionService{
		submissionRepo:     submissionRepo,
		testCaseResultRepo: testCaseResultRepo,
		problemRepo:        problemRepo,
		userRepo:           userRepo,
	}
}

// SubmitSolution creates a new submission and queues it for judging.
func (s *SubmissionService) SubmitSolution(req *dto.SubmitRequest, userID uuid.UUID, ipAddress string) (*domain.Submission, error) {
	problem, err := s.problemRepo.FindBySlug(req.Slug)
	if err != nil {
		return nil, errors.New("problem not found")
	}

	if !isValidLanguage(req.Language) {
		return nil, errors.New("unsupported language")
	}

	submission := &domain.Submission{
		UserID:      userID,
		ProblemID:   problem.ID,
		Code:        req.Code,
		Language:    req.Language,
		Verdict:     domain.VerdictQueued,
		IPAddress:   ipAddress,
		SubmittedAt: time.Now(),
	}

	if err := s.submissionRepo.Create(submission); err != nil {
		return nil, err
	}

	// Increment submission count
	if err := s.problemRepo.IncrementSubmissionCount(problem.ID); err != nil {
		// Log error but continue
	}

	// Push to Redis queue for async judging
	if err := config.PushSubmissionJob(submission.ID); err != nil {
		return nil, err
	}

	return submission, nil
}

// GetSubmission retrieves a submission details.
func (s *SubmissionService) GetSubmission(id uuid.UUID, userID uuid.UUID, isAdmin bool) (*dto.SubmissionResponse, error) {
	submission, err := s.submissionRepo.FindByID(id)
	if err != nil {
		return nil, err
	}

	if submission.UserID != userID && !isAdmin {
		return nil, errors.New("unauthorized")
	}

	var testResults []dto.TestCaseResultDTO
	for _, tr := range submission.TestResults {
		testResults = append(testResults, dto.TestCaseResultDTO{
			ID:            tr.ID,
			Verdict:       tr.Verdict,
			ExecutionTime: tr.ExecutionTime,
			MemoryUsed:    tr.MemoryUsed,
			Output:        tr.Output,
			ErrorMessage:  tr.ErrorMessage,
		})
	}

	return &dto.SubmissionResponse{
		ID:            submission.ID,
		Verdict:       submission.Verdict,
		ExecutionTime: submission.ExecutionTime,
		MemoryUsed:    submission.MemoryUsed,
		Score:         submission.Score,
		TestsPassed:   submission.TestsPassed,
		TestsFailed:   submission.TestsFailed,
		Code:          submission.Code, // Only show code to owner or admin
		Language:      submission.Language,
		SubmittedAt:   submission.SubmittedAt,
		JudgedAt:      submission.JudgedAt,
		TestResults:   testResults,
	}, nil
}

// ListMySubmissions lists submissions for the current user.
func (s *SubmissionService) ListMySubmissions(userID uuid.UUID, pagination *dto.PaginationRequest) (*dto.SubmissionListResponse, error) {
	domainPagination := &domain.Pagination{
		Limit:  pagination.Limit,
		Offset: pagination.Page * pagination.Limit,
	}

	submissions, total, err := s.submissionRepo.FindByUserID(userID, domainPagination)
	if err != nil {
		return nil, err
	}

	var submissionDTOs []dto.SubmissionSummaryDTO
	for _, sub := range submissions {
		submissionDTOs = append(submissionDTOs, dto.SubmissionSummaryDTO{
			ID:          sub.ID,
			ProblemSlug: "", // Fetch if needed
			Verdict:     sub.Verdict,
			SubmittedAt: sub.SubmittedAt,
		})
	}

	return &dto.SubmissionListResponse{
		Submissions: submissionDTOs,
		Total:       total,
		Page:        pagination.Page,
		Limit:       pagination.Limit,
	}, nil
}

// ListAllSubmissions lists all submissions (admin only).
func (s *SubmissionService) ListAllSubmissions(pagination *dto.PaginationRequest, filters *dto.SubmissionFilters) (*dto.SubmissionListResponse, error) {
	domainPagination := &domain.Pagination{
		Limit:  pagination.Limit,
		Offset: pagination.Page * pagination.Limit,
	}
	domainFilters := &domain.SubmissionFilters{
		ProblemID: filters.ProblemID,
		Verdict:   filters.Verdict,
	}

	submissions, total, err := s.submissionRepo.FindAll(domainPagination, domainFilters)
	if err != nil {
		return nil, err
	}

	var submissionDTOs []dto.SubmissionSummaryDTO
	for _, sub := range submissions {
		submissionDTOs = append(submissionDTOs, dto.SubmissionSummaryDTO{
			ID:          sub.ID,
			UserID:      sub.UserID,
			ProblemID:   sub.ProblemID,
			Verdict:     sub.Verdict,
			SubmittedAt: sub.SubmittedAt,
		})
	}

	return &dto.SubmissionListResponse{
		Submissions: submissionDTOs,
		Total:       total,
		Page:        pagination.Page,
		Limit:       pagination.Limit,
	}, nil
}

// UpdateSubmissionAfterJudging updates the submission after judging (called by worker).
func (s *SubmissionService) UpdateSubmissionAfterJudging(submissionID uuid.UUID, verdict string, executionTime int, memoryUsed int, score float64, testsPassed int, testsFailed int, testResults []*domain.TestCaseResult) error {
	submission, err := s.submissionRepo.FindByID(submissionID)
	if err != nil {
		return err
	}

	submission.Verdict = verdict
	submission.ExecutionTime = executionTime
	submission.MemoryUsed = memoryUsed
	submission.Score = score
	submission.TestsPassed = testsPassed
	submission.TestsFailed = testsFailed
	submission.JudgedAt = &time.Time{} // Set to current time
	*submission.JudgedAt = time.Now()

	if err := s.submissionRepo.Update(submission); err != nil {
		return err
	}

	// Create test case results
	if err := s.testCaseResultRepo.CreateBatch(testResults); err != nil {
		return err
	}

	// If accepted, update user and problem stats
	if verdict == domain.VerdictAC {
		if err := s.problemRepo.IncrementAcceptedCount(submission.ProblemID); err != nil {
			// Log
		}
		user, err := s.userRepo.FindByID(submission.UserID)
		if err == nil {
			user.SolvedProblems++
			// Update rating (simple Elo-like, or use advanced system)
			user.Rating += 10 // Placeholder
			s.userRepo.Update(user)
		}
	}

	return nil
}

func isValidLanguage(lang string) bool {
	valid := []string{domain.LangCPP, domain.LangPython, domain.LangJava, domain.LangRust, domain.LangGo}
	for _, v := range valid {
		if v == lang {
			return true
		}
	}
	return false
}
