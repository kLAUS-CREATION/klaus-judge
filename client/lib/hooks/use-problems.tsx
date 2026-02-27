import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    listProblems,
    getProblem,
    createProblem,
    updateProblem,
    deleteProblem
} from "@/features/api/problems.api";
import { CreateProblemRequest, UpdateProblemRequest } from "@/types/problems";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useProblems = (page = 1, limit = 20, difficulty?: string, tags?: string) => {
    return useQuery({
        queryKey: ["problems", page, limit, difficulty, tags],
        queryFn: () => listProblems(page, limit, difficulty, tags),
        placeholderData: (previousData) => previousData,
    });
};

export const useProblem = (slug: string) => {
    return useQuery({
        queryKey: ["problem", slug],
        queryFn: () => getProblem(slug),
        enabled: !!slug,
    });
};

export const useCreateProblem = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (data: CreateProblemRequest) => createProblem(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["problems"] });
            toast.success("Problem created successfully");
            router.push("/home/admin/problems"); // Assuming admin route
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to create problem");
        },
    });
};

export const useUpdateProblem = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: ({ slug, data }: { slug: string; data: UpdateProblemRequest }) => updateProblem(slug, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["problems"] });
            queryClient.invalidateQueries({ queryKey: ["problem", variables.slug] });
            toast.success("Problem updated successfully");
            router.push("/home/admin/problems");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to update problem");
        },
    });
};

export const useDeleteProblem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (slug: string) => deleteProblem(slug),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["problems"] });
            toast.success("Problem deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to delete problem");
        },
    });
};
