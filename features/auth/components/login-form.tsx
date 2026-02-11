"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShieldCheck, AlertCircle, Github, Info } from "lucide-react";
import { toast } from "sonner";

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
import Link from "next/link";

import { loginSchema, LoginSchema } from "../schemas";
import { useLogin } from "../hooks/use-login";

export function LoginForm() {
    const { mutate: login, isPending, error } = useLogin();

    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = (data: LoginSchema) => {
        login(data);
    };

    const handleFeatureUnavailable = (feature: string) => {
        toast.info(`${feature} is coming soon!`, {
            description: "We are currently implementing this feature. Please use email login for now.",
            icon: <Info className="h-4 w-4 text-blue-500" />,
            duration: 3000,
        });
    };

    return (
        <Card className="border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl backdrop-blur-sm bg-white/70 dark:bg-zinc-950/70 overflow-hidden">
            <CardContent className="pt-8 space-y-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold text-zinc-700 dark:text-zinc-300">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="name@example.com"
                                            className="h-10 bg-background/50"
                                            autoFocus
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
                                    <div className="flex items-center justify-between">
                                        <FormLabel className="font-semibold text-zinc-700 dark:text-zinc-300">Password</FormLabel>

                                        <button
                                            type="button"
                                            onClick={() => handleFeatureUnavailable("Password Reset")}
                                            className="text-xs text-primary hover:text-primary/80 hover:underline font-medium focus:outline-none"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            className="h-10 bg-background/50"
                                            disabled={isPending}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Stable Error Container */}
                        <div className="min-h-[24px]">
                            {error && (
                                <div className="bg-destructive/10 border border-destructive/20 p-2.5 rounded-lg text-xs text-destructive font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <span>{(error as any)?.response?.data?.message || "Invalid credentials."}</span>
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
                                <ShieldCheck className="mr-2 h-4 w-4" />
                            )}
                            {isPending ? "Verifying..." : "Sign In"}
                        </Button>
                    </form>
                </Form>

                {/* Social Auth Separator */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Button
                        variant="outline"
                        className="h-10"
                        disabled={isPending}
                        type="button"
                        onClick={() => handleFeatureUnavailable("Github Login")}
                    >
                        <Github className="mr-2 h-4 w-4" /> Github
                    </Button>
                    <Button
                        variant="outline"
                        className="h-10"
                        disabled={isPending}
                        type="button"
                        onClick={() => handleFeatureUnavailable("Google Login")}
                    >
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Google
                    </Button>
                </div>

            </CardContent>
            <CardFooter className="justify-center border-t bg-zinc-50/50 dark:bg-zinc-900/50 py-4">
                <p className="text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-primary font-bold hover:underline transition-all">
                        Join DevVault
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}