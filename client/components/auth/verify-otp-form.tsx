"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { otpSchema } from "@/lib/validations/otp.validation";
import { useVerifyEmail } from "@/lib/hooks/use-users";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";

type FormValues = z.infer<typeof otpSchema>;

export default function VerifyOtpForm() {
    const { mutate, isPending } = useVerifyEmail();

    const form = useForm<FormValues>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: "",
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
                        Verify your Email
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Please enter the 6-digit code sent to your email.
                    </p>
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6 flex flex-col items-center"
                    >
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-center">
                                    <FormLabel className="sr-only">One-Time Password</FormLabel>
                                    <FormControl>
                                        <InputOTP maxLength={6} {...field} disabled={isPending}>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormDescription>
                                        Enter the 6-digit code sent to your email.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button variant={"default"} type="submit" disabled={isPending} className="w-full">
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                "Verify Account"
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
