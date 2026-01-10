package services

import (
	"strings"

	"github.com/gosimple/slug"
	slugPkg "github.com/gosimple/slug"
	"github.com/klaus-creations/klaus-judge/api/internal/domain"
	"github.com/klaus-creations/klaus-judge/api/internal/dto"
	"github.com/klaus-creations/klaus-judge/api/internal/repository"
)

// ProblemService handles problem-related business logic.
type ProblemService struct {
	problemRepo repository.ProblemRepository
	testCaseRepo repository.TestCaseRepository
}

// NewProblemService creates a new problem service.
func NewProblemService(problemRepo repository.ProblemRepository, testCaseRepo repository.TestCaseRepository) *ProblemService {
	return &ProblemService{
		problemRepo: problemRepo,
		testCaseRepo: testCaseRepo,
	}
}

// CreateProblem creates a new problem.
func (s *ProblemService) CreateProblem(req *dto.CreateProblemRequest, createdBy uint) (*domain.Problem, error) {
	// Generate slug
	slugStr := slug.Make(req.Title)
	if _, err := s.problemRepo.FindBySlug(slugStr); err == nil {
		slugStr = slug.Make(req.Title + "-" + strings.ToLower(req.Difficulty))
	}

	problem := &domain.Problem{
		Title:        req.Title,
		Slug:         slugStr,
		Description:  req.Description,
		Difficulty:   req.Difficulty,
		TimeLimit:    req.TimeLimit,
		MemoryLimit:  req.MemoryLimit,
		Tags:         strings.Join(req.Tags, ","),
		CreatedBy:    createdBy,
	}

	if err := s.problemRepo.Create(problem); err != nil {
		return nil, err
	}

	// Add test cases if provided
	for order, tc := range req.TestCases {
		testCase := &domain.TestCase{
			ProblemID:      problem.ID,
			Input:          tc.Input,
			ExpectedOutput: tc.ExpectedOutput,
			IsSample:       tc.IsSample,
			Points:         tc.Points,
			OrderIndex:     order + 1,
		}
		if err := s.testCaseRepo.Create(testCase); err != nil {
			return nil, err
		}
	}

	return problem, nil
}

// GetProblem retrieves a problem by slug, with optional test cases for admin.
func (s *ProblemService) GetProblem(slug string, includeHiddenTestCases bool) (*dto.ProblemResponse, error) {
	problem, err := s.problemRepo.FindBySlug(slug)
	if err != nil {
		return nil, err
	}

	testCases, err := s.testCaseRepo.FindByProblemID(problem.ID)
	if err != nil {
		return nil, err
	}

	var filteredTestCases []dto.TestCaseDTO
	for _, tc := range testCases {
		if includeHiddenTestCases || tc.IsSample {
			filteredTestCases = append(filteredTestCases, dto.TestCaseDTO{
				ID:             tc.ID,
				Input:          tc.Input,
				ExpectedOutput: tc.ExpectedOutput,
				IsSample:       tc.IsSample,
				Points:         tc.Points,
			})
		}
	}

	tags := strings.Split(problem.Tags, ",")

	return &dto.ProblemResponse{
		ID:             problem.ID,
		Title:          problem.Title,
		Slug:           problem.Slug,
		Description:    problem.Description,
		Difficulty:     problem.Difficulty,
		TimeLimit:      problem.TimeLimit,
		MemoryLimit:    problem.MemoryLimit,
		Tags:           tags,
		AcceptedCount:  problem.AcceptedCount,
		SubmissionCount: problem.SubmissionCount,
		TestCases:      filteredTestCases,
	}, nil
}

// ListProblems lists problems with pagination and filters.
func (s *ProblemService) ListProblems(pagination *dto.PaginationRequest, filters *dto.ProblemFilters) (*dto.ProblemListResponse, error) {
	domainPagination := &domain.Pagination{
		Limit:  pagination.Limit,
		Offset: pagination.Page * pagination.Limit,
	}
	domainFilters := &domain.ProblemFilters{
		Difficulty: filters.Difficulty,
		Tags:       filters.Tags,
	}

	problems, total, err := s.problemRepo.FindAll(domainPagination, domainFilters)
	if err != nil {
		return nil, err
	}

	var problemDTOs []dto.ProblemSummaryDTO
	for _, p := range problems {
		tags := strings.Split(p.Tags, ",")
		problemDTOs = append(problemDTOs, dto.ProblemSummaryDTO{
			ID:             p.ID,
			Title:          p.Title,
			Slug:           p.Slug,
			Difficulty:     p.Difficulty,
			Tags:           tags,
			AcceptedCount:  p.AcceptedCount,
			SubmissionCount: p.SubmissionCount,
		})
	}

	return &dto.ProblemListResponse{
		Problems: problemDTOs,
		Total:    total,
		Page:     pagination.Page,
		Limit:    pagination.Limit,
	}, nil
}

// UpdateProblem updates a problem.
func (s *ProblemService) UpdateProblem(slug string, req *dto.UpdateProblemRequest) (*domain.Problem, error) {
	problem, err := s.problemRepo.FindBySlug(slug)
	if err != nil {
		return nil, err
	}

	if req.Title != "" {
		problem.Title = req.Title
		problem.Slug = slugPkg.Make(req.Title)
	}
	if req.Description != "" {
		problem.Description = req.Description
	}
	if req.Difficulty != "" {
		problem.Difficulty = req.Difficulty
	}
	if req.TimeLimit != 0 {
		problem.TimeLimit = req.TimeLimit
	}
	if req.MemoryLimit != 0 {
		problem.MemoryLimit = req.MemoryLimit
	}
	if len(req.Tags) > 0 {
		problem.Tags = strings.Join(req.Tags, ",")
	}

	if err := s.problemRepo.Update(problem); err != nil {
		return nil, err
	}
	return problem, nil
}

// DeleteProblem deletes a problem.
func (s *ProblemService) DeleteProblem(slug string) error {
	problem, err := s.problemRepo.FindBySlug(slug)
	if err != nil {
		return err
	}
	return s.problemRepo.Delete(problem.ID)
}

// AddTestCase adds a new test case to a problem.
func (s *ProblemService) AddTestCase(slug string, req *dto.TestCaseRequest) (*domain.TestCase, error) {
	problem, err := s.problemRepo.FindBySlug(slug)
	if err != nil {
		return nil, err
	}

	testCase := &domain.TestCase{
		ProblemID:      problem.ID,
		Input:          req.Input,
		ExpectedOutput: req.ExpectedOutput,
		IsSample:       req.IsSample,
		Points:         req.Points,
		OrderIndex:     req.OrderIndex,
	}

	if err := s.testCaseRepo.Create(testCase); err != nil {
		return nil, err
	}
	return testCase, nil
}

// UpdateTestCase updates a test case.
func (s *ProblemService) UpdateTestCase(id uint, req *dto.TestCaseRequest) (*domain.TestCase, error) {
	testCase, err := s.testCaseRepo.FindByID(id)
	if err != nil {
		return nil, err
	}

	if req.Input != "" {
		testCase.Input = req.Input
	}
	if req.ExpectedOutput != "" {
		testCase.ExpectedOutput = req.ExpectedOutput
	}
	testCase.IsSample = req.IsSample
	if req.Points != 0 {
		testCase.Points = req.Points
	}
	if req.OrderIndex != 0 {
		testCase.OrderIndex = req.OrderIndex
	}

	if err := s.testCaseRepo.Update(testCase); err != nil {
		return nil, err
	}
	return testCase, nil
}

// DeleteTestCase deletes a test case.
func (s *ProblemService) DeleteTestCase(id uint) error {
	return s.testCaseRepo.Delete(id)
}
