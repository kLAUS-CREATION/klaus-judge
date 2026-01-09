package dto

import "time"


// ALL REQUESTS RELATED TO USER
// SignUpRequest is used for user registration.
type SignUpRequest struct {
	FullName string `json:"full_name" binding:"required,min=2"`
	Email    string `json:"email" binding:"required,email"`
	Username string `json:"username" binding:"required,min=3,alphanum"`
	Password string `json:"password" binding:"required,min=8"`
}

// LoginRequest is used for user authentication.
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// UpdateProfileRequest allows users to update their profile.
type UpdateProfileRequest struct {
	FullName string `json:"full_name" binding:"omitempty,min=2"`
	Username string `json:"username" binding:"omitempty,min=3,alphanum"`
}

// RefreshTokenRequest for refreshing JWT.
type RefreshTokenRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

// ALL RESPONSES RELATED TO USER
// UserResponse is a safe response without sensitive data.
type UserResponse struct {
	ID       uint   `json:"id"`
	FullName string `json:"full_name"`
	Email    string `json:"email"`
	Username string `json:"username"`
	Role     string `json:"role"`
	Verified bool   `json:"verified"`
	CreatedAt time.Time `json:"created_at"`
}

// UserStatsResponse for user statistics in online judge context.
type UserStatsResponse struct {
	SolvedProblems int `json:"solved_problems"`
	Rating         int `json:"rating"`
	LastLogin      time.Time `json:"last_login"`
}

// AuthResponse for login/refresh with tokens.
type AuthResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresIn    int    `json:"expires_in"` // in seconds
}
