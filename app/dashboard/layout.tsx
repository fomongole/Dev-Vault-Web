"use client";

import React, { useState } from "react";
import Link from "next/link"; // ✅ Use Link for navigation
import { useRouter } from "next/navigation";
import { LogOut, Settings, ShieldCheck, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { CreateSnippetDialog } from "@/features/snippets/components/create-snippet-dialog";
import AuthGuard from "@/features/auth/components/auth-guard";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQueryClient } from "@tanstack/react-query";

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    const handleLogout = () => {
        // 1. Clear Token
        localStorage.removeItem("token");

        // 2. Clear React Query Cache (Important for security/data freshness)
        queryClient.clear();

        // 3. Redirect
        router.replace("/login");
    };

    return (
        <AuthGuard>
            <div className="min-h-screen flex flex-col bg-zinc-50/50 dark:bg-zinc-950/50">
                {/* backdrop-blur for a modern OS feel
                */}
                <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
                    <div className="container mx-auto flex h-16 items-center justify-between px-6">

                        {/* Logo Area */}
                        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-90 transition-opacity">
                            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-sm">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <span className="hidden sm:inline-block">DevVault</span>
                        </Link>

                        {/* Actions Area */}
                        <div className="flex items-center gap-3 md:gap-4">
                            {/* Create Button is usually Primary CTA */}
                            <CreateSnippetDialog />

                            <div className="h-6 w-[1px] bg-border hidden sm:block" />

                            <ModeToggle />

                            {/* User Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 border border-border">
                                        <Avatar className="h-8 w-8">
                                            {/* Ideally use user's image here */}
                                            <AvatarImage src="" />
                                            <AvatarFallback className="bg-primary/10 text-primary text-xs">DV</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">My Account</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                Manage your profile
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            Dashboard
                                        </DropdownMenuItem>
                                        <DropdownMenuItem disabled>
                                            <Settings className="mr-2 h-4 w-4" />
                                            Settings
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-red-600 focus:text-red-600 focus:bg-red-100 dark:focus:bg-red-900/30 cursor-pointer"
                                        onClick={() => setShowLogoutDialog(true)}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 container mx-auto p-6 md:py-8 animate-in fade-in duration-500">
                    {children}
                </main>

                {/* Logout Confirmation */}
                <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to leave?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Your session will end and you will be redirected to the login page.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 text-white border-red-600"
                            >
                                <LogOut className="mr-2 h-4 w-4" /> Log out
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AuthGuard>
    );
}