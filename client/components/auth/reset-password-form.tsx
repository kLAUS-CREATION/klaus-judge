"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { resetPasswordSchema } from "@/lib/validations/reset-password.validation";
import { useResetPassword } from "@/lib/hooks/use-users";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type FormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const { mutate, isPending } = useResetPassword();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    function onSubmit(values: FormValues) {
        if (!token) {
            // Should ideally be handled by rendering an error state if token is missing
            return;
        }
        mutate({
            password: values.password,
            token: token,
        });
    }

    if (!token) {
        return (
            <div className="size-full flex items-center justify-center p-4">
                <div className="w-full space-y-8 rounded-2xl p-8 text-center">
                    <h2 className="text-2xl font-bold text-destructive">Invalid Link</h2>
                    <p className="text-muted-foreground">The password reset link is invalid or has expired.</p>
                    <Link
                        href="/home/auth/sign-in"
                        className="text-sm font-semibold text-primary hover:underline"
                    >
                        Return to Sign In
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="size-full flex items-center justify-center p-4">
            <div className="w-full space-y-8 rounded-2xl p-8 transition-all dark:ring-1 dark:ring-white/10 dark:backdrop-blur-xl">
                <div className="text-center mb-6">
                    <h2 className="text-2xl 2xl:text-3xl font-bold tracking-[1px] mb-2">
                        Reset Password
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Enter your new password below.
                    </p>
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="h-11 pr-10 rounded-lg border-gray-300/30 transition"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                disabled={isPending}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:bg-transparent"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                                <span className="sr-only">
                                                    {showPassword ? "Hide password" : "Show password"}
                                                </span>
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="h-11 pr-10 rounded-lg border-gray-300/30 transition"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                disabled={isPending}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:bg-transparent"
                                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                                <span className="sr-only">
                                                    {showConfirmPassword ? "Hide password" : "Show password"}
                                                </span>
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button variant={"default"} type="submit" disabled={isPending} className="w-full">
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Resetting Password...
                                </>
                            ) : (
                                "Reset Password"
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
