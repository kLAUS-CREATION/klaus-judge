import apiClient from "@/config/axios";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from "@/types/users";
import { setTokens, setUser } from "@/lib/utils/cookies";

export const register = async (data: RegisterRequest): Promise<User> => {
  // Note: Matches backend route /auth/register
  const response = await apiClient.post<User>("/auth/auth/register", data);
  return response.data;
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  // Note: Matches backend route /auth/login
  const response = await apiClient.post<LoginResponse>(
    "/auth/auth/login",
    data,
  );

  // Store tokens and user
  if (response.data.tokens) {
    setTokens(
      response.data.tokens.access_token,
      response.data.tokens.refresh_token,
    );
  }
  if (response.data.user) {
    setUser(response.data.user);
  }

  return response.data;
};

export const logout = async (): Promise<void> => {
  // Note: Matches backend route /auth/logout
  await apiClient.post("/auth/logout");
};

export const refreshToken = async (
  refreshToken: string,
): Promise<LoginResponse> => {
  // Note: Matches backend route /auth/refresh
  const response = await apiClient.post<LoginResponse>("/auth/refresh", {
    refresh_token: refreshToken,
  });

  if (response.data.tokens.access_token && response.data.tokens.refresh_token) {
    setTokens(
      response.data.tokens.access_token,
      response.data.tokens.refresh_token,
    );
  }

  return response.data;
};
