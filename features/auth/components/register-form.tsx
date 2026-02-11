"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeOff, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { registerSchema, RegisterSchema } from "../schemas";
import { useRegister } from "../hooks/use-register";

export function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);

    const { mutate: register, isPending, error } = useRegister();

    const form = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
        defaultValues: { fullName: "", email: "", password: "" },
    });

    const onSubmit = (data: RegisterSchema) => {
        register(data);
    };

    return (
        <Card className="border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl backdrop-blur-sm bg-white/70 dark:bg-zinc-950/70 overflow-hidden">
            <CardContent className="pt-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold text-zinc-900 dark:text-zinc-100">Full Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="John Doe"
                                            className="h-10 bg-background/50"
                                            disabled={isPending}
                                            {...field}
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
                                    <FormLabel className="font-semibold text-zinc-900 dark:text-zinc-100">Email Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="name@example.com"
                                            className="h-10 bg-background/50"
                                            disabled={isPending}
                                            {...field}
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
                                    <FormLabel className="font-semibold text-zinc-900 dark:text-zinc-100">Password</FormLabel>
                                    <div className="relative">
                                        <FormControl>
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="h-10 bg-background/50 pr-10"
                                                disabled={isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="min-h-[24px]">
                            {error && (
                                <div className="bg-destructive/10 border border-destructive/20 p-2.5 rounded-lg text-xs text-destructive font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <span>{(error as any)?.response?.data?.message || "Registration failed. Please try again."}</span>
                                </div>
                            )}
                        </div>

                        <Button
                            className="w-full h-10 shadow-md transition-all active:scale-[0.98]"
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Sparkles className="mr-2 h-4 w-4" />
                            )}
                            {isPending ? "Creating Account..." : "Register Now"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="justify-center border-t bg-zinc-50/50 dark:bg-zinc-900/50 py-4">
                <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary font-bold hover:underline transition-all">
                        Sign In
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}