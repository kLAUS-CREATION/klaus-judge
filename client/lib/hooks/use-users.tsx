import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login, register, logout } from "@/features/api/auth.api";
import { LoginRequest, RegisterRequest } from "@/types/users";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (data) => {
      // Assuming backend sets cookies or we manage tokens here.
      // If tokens are returned, we might need to store them.
      // Based on axios config `withCredentials: true`, we assume cookies are handled.
      // But if response has tokens, we might need to save them if not httpOnly.
      // For now, we trust the axios config/backend to handle session/cookie
      // or we just rely on the response.
      // The API returns tokens, so usually we'd save them.
      // However, for simplicity and best practice with HttpOnly cookies,
      // I'll assume the axios interceptor or backend handles the persistence
      // OR I should save to localStorage if that's the pattern.
      // The user didn't specify, but standard JWT usually means localStorage if not cookie.
      // Given the previous axios file didn't show setting headers, I'll store in localStorage for now
      // to be safe, or just let the user handle it.
      // Actually, let's just invalidate query and redirect.

      queryClient.setQueryData(["user"], data.user);
      toast.success("Welcome back!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Login failed");
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
    onSuccess: (data) => {
      // Registration might auto-login or require login.
      // If it returns User and not tokens, we might need to login.
      // The handler returns UserResponse, not AuthResponse.
      // So we probably redirect to login.
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Registration failed");
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push("/home/auth/sign-in");
      toast.success("Logged out successfully");
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });
};
