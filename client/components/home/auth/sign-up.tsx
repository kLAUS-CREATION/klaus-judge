"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { registerSchema } from "@/lib/validations/login.validation";

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
import { useRegister } from "@/lib/hooks/use-users";

type FormValues = z.infer<typeof registerSchema>;

export default function SignUp() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const { mutate, isPending } = useRegister();

    const form = useForm<FormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: "",
            username: "",
            email: "",
            password: "",
        },
    });

    function onSubmit(values: FormValues) {
        setServerError(null);

        mutate(
            {
                full_name: values.fullName,
                username: values.username,
                email: values.email,
                password: values.password,
            },
            {
                onSuccess: () => {
                    // Redirect handled in hook
                },
                onError: (error: any) => {
                    console.error("Registration failed:", error);
                    setServerError(error.response?.data?.error || "Registration failed. Please try again.");
                },
            }
        );
    }

    return (
        <div className="flex  w-full items-center justify-center">
            <div className="w-full space-y-8 rounded-2xl transition-all dark:backdrop-blur-xl">
                <h2 className="text-2xl 2xl:text-3xl font-normal text-center mb-6 tracking-[2px]">
                    Create An Account
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
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground-secondary">Full Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="John Doe"
                                            className="h-13 rounded-xs mt-1 border focus:border-foreground-secondary transition text-foreground-secondary"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground-secondary">Email Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="email"
                                            disabled={isPending}
                                            placeholder="you@example.com"
                                            className="h-13 rounded-xs mt-1 border focus:border-foreground-secondary transition text-foreground-secondary"
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
                                    <FormLabel className="text-foreground-secondary"> Password </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="h-13 rounded-xs mt-1 border focus:border-foreground-secondary transition text-foreground-secondary"
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

                        <Button variant={"btn"} type="submit" disabled={isPending} className="w-full">
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                    </form>
                </Form>

                <p className="mt-6 text-center text-sm text-foreground-secondary tracking-[1px]">
                    Already have an account?{" "}
                    <Link
                        href="/home/auth/sign-in"
                        className={`text-foreground font-semibold hover:underline ${isPending ? "pointer-events-none opacity-50" : ""
                            }`}
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
