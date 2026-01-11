import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    login,
    register,
    getProfile,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword,
    verifyEmail,
} from "@/features/api/auth.api";
import {
    LoginRequest,
    RegisterRequest,
    UpdateProfileRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    VerifyEmailRequest
} from "@/types/users";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Assuming sonner is used for toasts based on package.json

export const useUser = () => {
    return useQuery({
        queryKey: ["user"],
        queryFn: getProfile,
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useLogin = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

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
            router.push("/home");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Login failed");
        },
    });
};

export const useRegister = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (data: RegisterRequest) => register(data),
        onSuccess: (data) => {
            // Registration might auto-login or require login. 
            // If it returns User and not tokens, we might need to login.
            // The handler returns UserResponse, not AuthResponse.
            // So we probably redirect to login.
            toast.success("Account created successfully! Please log in.");
            router.push("/home/auth/sign-in");
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

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: (data: ForgotPasswordRequest) => forgotPassword(data),
        onSuccess: () => {
            toast.success("If your email is registered, you will receive a password reset link.");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to send reset link");
        },
    });
};

export const useResetPassword = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: (data: ResetPasswordRequest) => resetPassword(data),
        onSuccess: () => {
            toast.success("Password reset successfully. Please login with your new password.");
            router.push("/home/auth/sign-in");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to reset password");
        },
    });
};

export const useVerifyEmail = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: (data: VerifyEmailRequest) => verifyEmail(data),
        onSuccess: () => {
            toast.success("Email verified successfully! Please log in.");
            router.push("/home/auth/sign-in");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Invalid verification code");
        },
    });
};
