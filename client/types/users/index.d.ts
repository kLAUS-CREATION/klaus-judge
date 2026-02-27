export interface User {
    id: string;
    full_name: string;
    email: string;
    username: string;
    role: string;
    verified: boolean;
    created_at: string;
}

export interface AuthTokens {
    access_token: string;
    refresh_token: string;
    expires_in: number;
}

export interface LoginResponse {
    tokens: AuthTokens;
    user: User;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    full_name: string;
    email: string;
    username: string;
    password: string;
}

export interface UpdateProfileRequest {
    full_name?: string;
    username?: string;
}


export interface UserStats {
    solved_problems: number;
    rating: number;
    last_login: string;
}
