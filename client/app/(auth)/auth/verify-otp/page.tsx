import VerifyOtpForm from "@/components/auth/verify-otp-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Verify Email | Klaus Judge",
    description: "Verify your email address",
};

export default function VerifyOtpPage() {
    return <VerifyOtpForm />;
}
