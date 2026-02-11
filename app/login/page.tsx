"use client";

import { LoginForm } from "@/features/auth/components/login-form";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import GuestGuard from "@/features/auth/components/guest-guard";

export default function LoginPage() {
    return (
        <GuestGuard>
            <AuthLayout
                title="Welcome Back"
                subtitle="Sign in to your DevVault to access your snippets."
            >
                <LoginForm />
            </AuthLayout>
        </GuestGuard>
    );
}