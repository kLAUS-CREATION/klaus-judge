import apiClient from "@/config/axios";
import {
  Submission,
  SubmissionSummary,
  SubmitRequest,
} from "@/types/submissions";

export interface SubmitResponse {
  id: string;
  verdict: string;
  message: string;
}

export const submitSolution = async (
  data: SubmitRequest,
): Promise<SubmitResponse> => {
  const response = await apiClient.post<SubmitResponse>("/submissions", data);
  return response.data;
};

export const listMySubmissions = async (
  page = 1,
  limit = 20,
): Promise<{ submissions: SubmissionSummary[]; total: number }> => {
  const response = await apiClient.get<{
    submissions: SubmissionSummary[];
    total: number;
  }>(`/submissions?page=${page - 1}&limit=${limit}`);
  return response.data;
};

export const getSubmission = async (id: string): Promise<Submission> => {
  const response = await apiClient.get<Submission>(`/submissions/${id}`);
  return response.data;
};

export const listAllSubmissions = async (
  page = 1,
  limit = 20,
  problemId?: string,
  verdict?: string,
): Promise<{ submissions: SubmissionSummary[]; total: number }> => {
  const params = new URLSearchParams({
    page: (page - 1).toString(),
    limit: limit.toString(),
  });

  if (problemId) params.append("problem_id", problemId);
  if (verdict) params.append("verdict", verdict);

  const response = await apiClient.get<{
    submissions: SubmissionSummary[];
    total: number;
  }>(`/submissions/all?${params.toString()}`);
  return response.data;
};
