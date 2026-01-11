"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

import { forgotPasswordSchema } from "@/lib/validations/reset-password.validation";
import { useForgotPassword } from "@/lib/hooks/use-users";

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

type FormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
    const { mutate, isPending } = useForgotPassword();

    const form = useForm<FormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    function onSubmit(values: FormValues) {
        mutate(values);
    }

    return (
        <div className="size-full flex items-center justify-center p-4">
            <div className="w-full space-y-8 rounded-2xl p-8 transition-all dark:ring-1 dark:ring-white/10 dark:backdrop-blur-xl">
                <div className="text-center mb-6">
                    <h2 className="text-2xl 2xl:text-3xl font-bold tracking-[1px] mb-2">
                        Forgot Password?
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Enter your email address and we&apos;ll send you a link to reset your password.
                    </p>
                </div>

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

                        <Button variant={"default"} type="submit" disabled={isPending} className="w-full">
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending Link...
                                </>
                            ) : (
                                "Send Reset Link"
                            )}
                        </Button>
                    </form>
                </Form>

                <div className="mt-6 text-center">
                    <Link
                        href="/home/auth/sign-in"
                        className={`text-sm font-semibold text-primary hover:underline ${isPending ? "pointer-events-none opacity-50" : ""
                            }`}
                    >
                        Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
