import apiClient from "@/config/axios";
import {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    User,
    UpdateProfileRequest,
} from "@/types/users";

export const register = async (data: RegisterRequest): Promise<User> => {
    const response = await apiClient.post<User>("/auth/register", data);
    return response.data;
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/auth/login", data);
    return response.data;
};

export const logout = async (): Promise<void> => {
    await apiClient.post("/auth/logout");
};

export const getProfile = async (): Promise<User> => {
    const response = await apiClient.get<User>("/auth/profile");
    return response.data;
};

export const updateProfile = async (
    data: UpdateProfileRequest
): Promise<User> => {
    const response = await apiClient.put<User>("/auth/profile", data);
    return response.data;
};
