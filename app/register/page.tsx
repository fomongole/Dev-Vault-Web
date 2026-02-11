"use client";

import { RegisterForm } from "@/features/auth/components/register-form";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import GuestGuard from "@/features/auth/components/guest-guard";

export default function RegisterPage() {
    return (
        <GuestGuard>
            <AuthLayout
                title="Create Account"
                subtitle="Join the community of developers securing their code."
            >
                <RegisterForm />
            </AuthLayout>
        </GuestGuard>
    );
}