package services

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/klaus-creations/klaus-judge/api/internal/config"
	"github.com/klaus-creations/klaus-judge/api/internal/domain"
	"github.com/klaus-creations/klaus-judge/api/internal/dto"
	"github.com/klaus-creations/klaus-judge/api/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

// AuthService handles authentication and user-related business logic.
type AuthService struct {
	userRepo             repository.UserRepository
	jwtSecret            string
	accessTokenDuration  time.Duration
	refreshTokenDuration time.Duration
}

// NewAuthService creates a new authentication service.
func NewAuthService(userRepo repository.UserRepository) *AuthService {
	jwtSecret := config.GetEnv("JWT_SECRET", "jwt_secret")
	accessDuration := 15 * time.Minute
	refreshDuration := 7 * 24 * time.Hour
	return &AuthService{
		userRepo:             userRepo,
		jwtSecret:            jwtSecret,
		accessTokenDuration:  accessDuration,
		refreshTokenDuration: refreshDuration,
	}
}

// Register creates a new user.
func (s *AuthService) Register(req *dto.SignUpRequest) (*domain.User, error) {
	// Check if email or username exists
	if _, err := s.userRepo.FindByEmail(req.Email); err == nil {
		return nil, errors.New("email already exists")
	}
	if _, err := s.userRepo.FindByUsername(req.Username); err == nil {
		return nil, errors.New("username already exists")
	}

	// Hash password
	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &domain.User{
		FullName:     req.FullName,
		Email:        req.Email,
		Username:     req.Username,
		PasswordHash: string(hash),
		Role:         "user",
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, err
	}
	return user, nil
}

// Login authenticates a user and generates tokens.
func (s *AuthService) Login(req *dto.LoginRequest) (*dto.AuthResponse, *domain.User, error) {
	user, err := s.userRepo.FindByEmail(req.Email)
	if err != nil {
		return nil, nil, errors.New("invalid credentials")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return nil, nil, errors.New("invalid credentials")
	}

	// Update last login
	user.LastLogin = time.Now()
	if err := s.userRepo.Update(user); err != nil {
		return nil, nil, err
	}

	// Generate tokens
	accessToken, err := s.generateJWT(user, s.accessTokenDuration)
	if err != nil {
		return nil, nil, err
	}
	refreshToken, err := s.generateJWT(user, s.refreshTokenDuration)
	if err != nil {
		return nil, nil, err
	}

	return &dto.AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    int(s.accessTokenDuration.Seconds()),
	}, user, nil
}

// RefreshToken generates a new access token from refresh token.
func (s *AuthService) RefreshToken(refreshToken string) (*dto.AuthResponse, error) {
	claims, err := s.validateJWT(refreshToken)
	if err != nil {
		return nil, err
	}

	userIDStr, ok := claims["user_id"].(string)
	if !ok {
		return nil, errors.New("invalid token claims")
	}
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return nil, errors.New("invalid user id in token")
	}

	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, errors.New("user not found")
	}

	accessToken, err := s.generateJWT(user, s.accessTokenDuration)
	if err != nil {
		return nil, err
	}

	return &dto.AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken, // Reuse or regenerate
		ExpiresIn:    int(s.accessTokenDuration.Seconds()),
	}, nil
}

// GetProfile retrieves user profile.
func (s *AuthService) GetProfile(userID uuid.UUID) (*dto.UserResponse, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, err
	}
	return &dto.UserResponse{
		ID:        user.ID,
		FullName:  user.FullName,
		Email:     user.Email,
		Username:  user.Username,
		Role:      user.Role,
		Verified:  user.Verified,
		CreatedAt: user.CreatedAt,
	}, nil
}

// UpdateProfile updates user details.
func (s *AuthService) UpdateProfile(userID uuid.UUID, req *dto.UpdateProfileRequest) (*dto.UserResponse, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, err
	}

	if req.FullName != "" {
		user.FullName = req.FullName
	}
	if req.Username != "" {
		if _, err := s.userRepo.FindByUsername(req.Username); err == nil {
			return nil, errors.New("username already exists")
		}
		user.Username = req.Username
	}

	if err := s.userRepo.Update(user); err != nil {
		return nil, err
	}

	return &dto.UserResponse{
		ID:        user.ID,
		FullName:  user.FullName,
		Email:     user.Email,
		Username:  user.Username,
		Role:      user.Role,
		Verified:  user.Verified,
		CreatedAt: user.CreatedAt,
	}, nil
}

// GetStats retrieves user statistics.
func (s *AuthService) GetStats(userID uuid.UUID) (*dto.UserStatsResponse, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, err
	}
	return &dto.UserStatsResponse{
		SolvedProblems: user.SolvedProblems,
		Rating:         user.Rating,
		LastLogin:      user.LastLogin,
	}, nil
}

// generateJWT creates a JWT token.
func (s *AuthService) generateJWT(user *domain.User, duration time.Duration) (string, error) {
	claims := jwt.MapClaims{
		"user_id": user.ID.String(),
		"role":    user.Role,
		"exp":     time.Now().Add(duration).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.jwtSecret))
}

// validateJWT parses and validates a JWT token.
func (s *AuthService) validateJWT(tokenStr string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid signing method")
		}
		return []byte(s.jwtSecret), nil
	})
	if err != nil {
		return nil, err
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, nil
	}
	return nil, errors.New("invalid token")
}

func (s *AuthService) Logout() error {
	// For stateless JWT, no server-side action needed.
	return nil
}
