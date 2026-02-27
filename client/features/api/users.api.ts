import apiClient from "@/config/axios";
import { User, UpdateProfileRequest, UserStats } from "@/types/users";

export const getProfile = async (): Promise<User> => {
  const response = await apiClient.get<User>("/users/profile");
  return response.data;
};

export const updateProfile = async (
  data: UpdateProfileRequest,
): Promise<User> => {
  const response = await apiClient.put<User>("/users/profile", data);
  return response.data;
};

export const getStats = async (): Promise<UserStats> => {
  const response = await apiClient.get<UserStats>("/users/stats");
  return response.data;
};
