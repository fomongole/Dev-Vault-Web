"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Github, Code2, Shield, Zap, Search, ArrowRight, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { usePublicSnippets } from "@/features/snippets/hooks/use-public-snippets";
import { SnippetCard } from "@/features/snippets/components/snippet-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
    const { data: snippetsResponse, isLoading } = usePublicSnippets();

    const snippets = snippetsResponse?.data || [];

    const [searchQuery, setSearchQuery] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check auth status to toggle Header buttons
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const filteredPublicFeed = useMemo(() => {
        if (!snippets) return [];
        return snippets.filter(s =>
            s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.language.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [snippets, searchQuery]);

    const scrollToFeed = () => {
        document.getElementById('feed')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen flex flex-col selection:bg-primary/10">
            {/* Background Decoration */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-blue-500/5 blur-[100px]" />
            </div>

            {/* Navbar */}
            <header className="border-b bg-background/80 backdrop-blur-md h-16 flex items-center justify-between px-6 sticky top-0 z-50 transition-all">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <div className="bg-primary p-1.5 rounded-lg shadow-sm">
                        <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span>DevVault</span>
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                    <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
                        <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                            <Github className="h-5 w-5" />
                            <span className="sr-only">GitHub</span>
                        </Link>
                    </Button>

                    <ModeToggle />

                    <div className="h-6 w-[1px] bg-border hidden sm:block" />

                    {/* DYNAMIC AUTH BUTTONS */}
                    {isLoggedIn ? (
                        <Link href="/dashboard">
                            <Button className="shadow-lg shadow-primary/20 gap-2">
                                <LayoutDashboard className="h-4 w-4" />
                                Go to Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login">
                                <Button variant="ghost">Login</Button>
                            </Link>
                            <Link href="/register">
                                <Button className="shadow-lg shadow-primary/20">Get Started</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-20 pb-16 px-6 overflow-hidden">
                <div className="container mx-auto flex flex-col items-center text-center space-y-8 relative z-10">
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Badge variant="secondary" className="px-4 py-1.5 rounded-full text-xs font-medium border border-primary/20 bg-primary/10 text-primary">
                            ✨ V2.0 is now live with 17+ languages
                        </Badge>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 max-w-4xl">
                        Code management <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-600 to-primary bg-300% animate-gradient">
                            for the modern dev.
                        </span>
                    </h1>

                    <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                        Stop losing your best code. Securely store private snippets or join our community of developers sharing high-performance solutions daily.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
                        <Link href={isLoggedIn ? "/dashboard" : "/register"}>
                            <Button size="lg" className="h-12 px-8 text-base shadow-xl shadow-primary/20 transition-transform hover:scale-105">
                                {isLoggedIn ? "Access Dashboard" : "Create Your Vault"}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Button size="lg" variant="outline" className="h-12 px-8 text-base" onClick={scrollToFeed}>
                            Explore Public Feed
                        </Button>
                    </div>

                    {/* ✅ VISUAL HERO ELEMENT */}
                    <div className="mt-12 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                        <div className="relative rounded-xl border bg-zinc-950/80 backdrop-blur shadow-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9]">
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                </div>
                                <div className="ml-4 text-xs font-mono text-zinc-500">sort-algorithm.ts</div>
                            </div>
                            <div className="p-6 font-mono text-sm md:text-base text-left text-zinc-300 leading-relaxed opacity-80">
                                <span className="text-purple-400">function</span> <span className="text-blue-400">quickSort</span>(arr: <span className="text-yellow-400">number</span>[]): <span className="text-yellow-400">number</span>[] &#123;<br/>
                                &nbsp;&nbsp;<span className="text-purple-400">if</span> (arr.length &lt;= 1) <span className="text-purple-400">return</span> arr;<br/>
                                &nbsp;&nbsp;<span className="text-purple-400">const</span> pivot = arr[arr.length - 1];<br/>
                                &nbsp;&nbsp;<span className="text-zinc-500">// ... Secure logic continues</span><br/>
                                &#125;
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Highlights */}
            <section className="container mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-y bg-zinc-50/50 dark:bg-zinc-900/50">
                <FeatureCard
                    icon={<Zap className="h-6 w-6 text-amber-500" />}
                    title="Lightning Fast"
                    desc="Built for speed. Find and copy code in seconds with global shortcuts and optimized search."
                />
                <FeatureCard
                    icon={<Shield className="h-6 w-6 text-blue-500" />}
                    title="Secure by Default"
                    desc="Enterprise-grade JWT auth, encryption, and strict private-first visibility controls."
                />
                <FeatureCard
                    icon={<Code2 className="h-6 w-6 text-primary" />}
                    title="Pro Syntax"
                    desc="Beautiful syntax highlighting for 17+ languages including TypeScript, Rust, Go, and Python."
                />
            </section>

            {/* Public Feed Section */}
            <main id="feed" className="flex-1 container mx-auto p-6 space-y-8 py-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Community Discoveries</h2>
                        <p className="text-muted-foreground max-w-lg">
                            Explore public solutions contributed by developers worldwide. Copy, learn, and adapt.
                        </p>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Filter community snippets..."
                            className="pl-10 bg-background"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Skeleton Loader Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="flex flex-col space-y-3">
                                <Skeleton className="h-[200px] w-full rounded-xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[250px]" />
                                    <Skeleton className="h-4 w-[200px]" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPublicFeed.map((snippet) => (
                            <SnippetCard
                                key={snippet.id}
                                snippet={snippet}
                                isReadOnly={true}
                            />
                        ))}

                        {/* Empty State */}
                        {filteredPublicFeed.length === 0 && (
                            <div className="col-span-full py-24 text-center border-2 border-dashed rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/50">
                                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                    <Terminal className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-bold">No snippets found</h3>
                                <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                                    We couldn't find any public snippets matching your search. Try different keywords.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t py-12 px-6 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-sm">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 font-bold opacity-70 hover:opacity-100 transition-opacity">
                        <div className="bg-primary/10 p-1 rounded">
                            <LayoutDashboard className="h-4 w-4 text-primary" />
                        </div>
                        <span>DevVault</span>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                        © 2026 DevVault Inc. Built with ❤️ for developers.
                    </p>
                    <div className="flex gap-6 text-sm text-muted-foreground font-medium">
                        <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
                        <Link href="#" className="hover:text-primary transition-colors">GitHub</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Simple sub-component for features
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors duration-300">
            <div className="p-4 bg-background rounded-2xl shadow-sm border ring-1 ring-border/50">{icon}</div>
            <div className="space-y-2">
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{desc}</p>
            </div>
        </div>
    );
}