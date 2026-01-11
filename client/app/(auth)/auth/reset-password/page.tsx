import ResetPasswordForm from "@/components/auth/reset-password-form";
import { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
    title: "Reset Password | Klaus Judge",
    description: "Set a new password",
};

export default function ResetPasswordPage() {
    return (
        <Suspense
            fallback={
                <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            }
        >
            <ResetPasswordForm />
        </Suspense>
    );
}
