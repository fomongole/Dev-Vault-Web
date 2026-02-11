"use client";

import { LayoutDashboard, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import React from "react";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative selection:bg-primary/10 overflow-hidden">
            {/* Background Layer */}
            <div className="fixed inset-0 -z-10 bg-zinc-50 dark:bg-zinc-950">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
                <div className="absolute bottom-[10%] -right-[5%] w-[30%] h-[30%] rounded-full bg-blue-500/10 blur-[100px]" />
            </div>

            <div className="absolute top-4 right-4 flex items-center gap-2">
                <ModeToggle />
            </div>

            <div className="absolute top-4 left-4">
                <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                    <Link href="/">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Link>
                </Button>
            </div>

            {/* Layout Container - Animations Removed */}
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <div className="flex justify-center mb-6">
                        <div className="bg-primary p-3 rounded-2xl shadow-xl shadow-primary/20">
                            <LayoutDashboard className="h-8 w-8 text-primary-foreground" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                        {title}
                    </h1>
                    <p className="text-muted-foreground">
                        {subtitle}
                    </p>
                </div>
                {/* Form Content */}
                {children}
            </div>
        </div>
    );
}