import apiClient from "@/config/axios";
import {
  Problem,
  ProblemSummary,
  CreateProblemRequest,
  UpdateProblemRequest,
} from "@/types/problems";

export const listProblems = async (
  page = 1,
  limit = 20,
  difficulty?: string,
  tags?: string,
): Promise<{ problems: ProblemSummary[]; total: number }> => {
  const params = new URLSearchParams({
    page: (page - 1).toString(),
    limit: limit.toString(),
  });
  if (difficulty) params.append("difficulty", difficulty);
  if (tags) params.append("tags", tags);

  const response = await apiClient.get<{
    problems: ProblemSummary[];
    total: number;
  }>(`/problems?${params.toString()}`);
  return response.data;
};

export const getProblem = async (slug: string): Promise<Problem> => {
  const response = await apiClient.get<Problem>(`/problems/${slug}`);
  return response.data;
};

// Admin Routes
export const createProblem = async (
  data: CreateProblemRequest,
): Promise<Problem> => {
  const response = await apiClient.post<Problem>("/problems", data);
  return response.data;
};

export const updateProblem = async (
  slug: string,
  data: UpdateProblemRequest,
): Promise<Problem> => {
  const response = await apiClient.put<Problem>(`/problems/${slug}`, data);
  return response.data;
};

export const deleteProblem = async (slug: string): Promise<void> => {
  await apiClient.delete(`/problems/${slug}`);
};

export const addTestCase = async (
  slug: string,
  data: Record<string, unknown>,
): Promise<Record<string, unknown>> => {
  const response = await apiClient.post(`/problems/${slug}/testcases`, data);
  return response.data;
};

export const updateTestCase = async (
  slug: string,
  testCaseId: string,
  data: Record<string, unknown>,
): Promise<Record<string, unknown>> => {
  const response = await apiClient.put(
    `/problems/${slug}/testcases/${testCaseId}`,
    data,
  );
  return response.data;
};

export const deleteTestCase = async (
  slug: string,
  testCaseId: string,
): Promise<void> => {
  await apiClient.delete(`/problems/${slug}/testcases/${testCaseId}`);
};
