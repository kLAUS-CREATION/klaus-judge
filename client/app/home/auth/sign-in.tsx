"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { formSchema } from "@/lib/validations/login.validation";

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
import { useLogin } from "@/lib/hooks/use-users";

type FormValues = z.infer<typeof formSchema>;

export default function SignIn() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const { mutate, isPending } = useLogin();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onSubmit(values: FormValues) {
        setServerError(null);

        mutate(
            {
                email: values.email,
                password: values.password,
            },
            {
                onSuccess: () => {
                    // Redirect handled in hook, but redundancy is fine or hook can remove router.push
                    // The hook does router.push("/home"), so this might be effectively ignored or run after.
                },
                onError: (error: any) => {
                    console.error("Login failed:", error);
                    setServerError(error.response?.data?.error || "Login failed. Please try again.");
                },
            }
        );
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl transition-all dark:bg-gray-950/50 dark:ring-1 dark:ring-white/10 dark:backdrop-blur-xl">
                <h2 className="text-2xl 2xl:text-3xl font-bold text-center mb-6 tracking-[1px]">
                    Welcome Back
                </h2>

                {serverError && (
                    <div className="mb-6 p-3 rounded-md bg-destructive/15 text-destructive text-sm flex items-center gap-x-2 border border-destructive/20">
                        <AlertCircle className="h-4 w-4" />
                        <p>{serverError}</p>
                    </div>
                )}

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="email"
                                            disabled={isPending}
                                            placeholder="you@example.com"
                                            className="h-11 rounded-lg border-gray-300/30 focus:border-[#003087] focus:ring-[#003087] transition"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
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

                        <div className="flex items-center justify-end">
                            <Link
                                href="/login/forget-password"
                                className={`text-sm font-semibold hover:underline ${isPending ? "pointer-events-none opacity-50" : ""
                                    }`}
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        <Button variant={"default"} type="submit" disabled={isPending} className="w-full">
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>
                </Form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/home/auth/sign-up"
                        className={`text-gray-900 font-semibold hover:underline ${isPending ? "pointer-events-none opacity-50" : ""
                            }`}
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
