import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    submitSolution,
    listMySubmissions,
    getSubmission
} from "@/features/api/submissions.api";
import { SubmitRequest } from "@/types/submissions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useSubmitSolution = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (data: SubmitRequest) => submitSolution(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["my-submissions"] });
            toast.success("Solution submitted successfully!");
            router.push(`/home/submissions/${data.id}`);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Submission failed");
        },
    });
};

export const useMySubmissions = (page = 1, limit = 20) => {
    return useQuery({
        queryKey: ["my-submissions", page, limit],
        queryFn: () => listMySubmissions(page, limit),
        placeholderData: (previousData) => previousData,
    });
};

export const useSubmission = (id: string) => {
    return useQuery({
        queryKey: ["submission", id],
        queryFn: () => getSubmission(id),
        enabled: !!id,
        refetchInterval: (query) => {
            // Poll if submission is pending or judging
            const data = query.state.data;
            if (data && (data.verdict === "PENDING" || data.verdict === "JUDGING" || data.verdict === "IN_QUEUE")) {
                return 1000;
            }
            return false;
        }
    });
};
