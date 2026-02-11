"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
    LayoutDashboard, Github, Code2, Shield, Zap, Search,
    ArrowRight, Terminal, Command, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { usePublicSnippets } from "@/features/snippets/hooks/use-public-snippets";
import { SnippetCard } from "@/features/snippets/components/snippet-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence, Variants } from "framer-motion";

// Explicitly typing these as Variants solves the build error
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
};

const itemVariants: Variants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 100, damping: 15 }
    }
};

export default function Home() {
    const { data: snippetsResponse, isLoading } = usePublicSnippets();
    const snippets = snippetsResponse?.data || [];

    const [searchQuery, setSearchQuery] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
        setIsLoggedIn(!!token);
    }, []);

    const filteredPublicFeed = useMemo(() => {
        if (!snippets) return [];
        const lowerQuery = searchQuery.toLowerCase();
        return snippets.filter(s =>
            s.title.toLowerCase().includes(lowerQuery) ||
            s.language.toLowerCase().includes(lowerQuery)
        );
    }, [snippets, searchQuery]);

    const scrollToFeed = () => {
        const element = document.getElementById('feed');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen flex flex-col selection:bg-primary/20 bg-background overflow-x-hidden">
            {/* --- BACKGROUND EFFECTS --- */}
            <div className="fixed inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]">
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]" />
            </div>

            {/* --- NAVBAR --- */}
            <header className="border-b bg-background/70 backdrop-blur-xl h-16 flex items-center justify-between px-6 sticky top-0 z-50 supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
                    <div className="bg-gradient-to-tr from-primary to-blue-600 p-1.5 rounded-lg shadow-lg shadow-primary/20">
                        <LayoutDashboard className="h-5 w-5 text-white" />
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">DevVault</span>
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                    <Button variant="ghost" size="icon" asChild className="hidden sm:flex transition-colors">
                        <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                            <Github className="h-5 w-5" />
                            <span className="sr-only">GitHub</span>
                        </Link>
                    </Button>

                    <ModeToggle />
                    <div className="h-6 w-[1px] bg-border hidden sm:block mx-1" />

                    {mounted ? (
                        isLoggedIn ? (
                            <Link href="/dashboard">
                                <Button className="shadow-lg shadow-primary/20 gap-2 font-medium">
                                    <LayoutDashboard className="h-4 w-4" />
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/login">
                                    <Button variant="ghost" className="font-medium">Sign In</Button>
                                </Link>
                                <Link href="/register">
                                    <Button className="shadow-lg shadow-primary/25 font-semibold bg-gradient-to-r from-primary to-blue-600">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        )
                    ) : (
                        <div className="w-24 h-9 bg-muted rounded-md animate-pulse" />
                    )}
                </div>
            </header>

            {/* --- HERO SECTION --- */}
            <section className="relative pt-24 pb-20 px-6">
                <div className="container mx-auto flex flex-col items-center text-center space-y-8 relative z-10">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                        <Badge variant="outline" className="px-4 py-1.5 rounded-full text-xs font-medium border-primary/20 bg-primary/5 text-primary backdrop-blur-sm flex items-center gap-2">
                            <Sparkles className="w-3 h-3" />
                            <span>V2.0 is live: Now supporting 17+ languages</span>
                        </Badge>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.1] max-w-4xl">
                        Code management <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-indigo-500">
                            for the modern dev.
                        </span>
                    </h1>

                    <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Stop losing your best code. Securely store private snippets or join our community of developers sharing high-performance solutions daily.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link href={isLoggedIn ? "/dashboard" : "/register"}>
                            <Button size="lg" className="h-12 px-8 text-base shadow-xl shadow-primary/20 transition-transform active:scale-95">
                                {isLoggedIn ? "Access Dashboard" : "Create Your Vault"}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Button size="lg" variant="outline" className="h-12 px-8 text-base backdrop-blur-sm bg-background/50" onClick={scrollToFeed}>
                            Explore Public Feed
                        </Button>
                    </div>

                    <motion.div
                        className="mt-16 w-full max-w-4xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur opacity-10 dark:opacity-25" />
                            <div className="relative rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/60 backdrop-blur-2xl shadow-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9]">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-white/5 bg-zinc-50/50 dark:bg-white/5">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                        <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                    </div>
                                    <div className="text-xs font-mono text-zinc-500 flex items-center gap-2">
                                        <Command className="w-3 h-3" /> sort-algo.ts
                                    </div>
                                    <div className="w-10" />
                                </div>
                                <div className="p-6 font-mono text-sm md:text-base text-left text-zinc-700 dark:text-zinc-300 leading-relaxed overflow-x-auto">
                                    <pre><code>
<span className="text-purple-600 dark:text-purple-400">interface</span> <span className="text-amber-600 dark:text-yellow-200">SortConfig</span> &#123;{"\n"}
                                        {"  "}<span className="text-blue-600 dark:text-blue-300">strategy</span>: <span className="text-green-600 dark:text-green-300">'quick'</span> | <span className="text-green-600 dark:text-green-300">'merge'</span>;{"\n"}
                                        {"  "}<span className="text-blue-600 dark:text-blue-300">secure</span>: <span className="text-orange-600 dark:text-orange-300">boolean</span>;{"\n"}
                                        &#125;{"\n\n"}
                                        <span className="text-purple-600 dark:text-purple-400">export const</span> <span className="text-blue-600 dark:text-blue-400">sortingVault</span> = &lt;T&gt;(arr: T[]): T[] =&gt; &#123;{"\n"}
                                        {"  "}<span className="text-purple-600 dark:text-purple-400">const</span> pivot = arr[Math.<span className="text-blue-600 dark:text-blue-400">floor</span>(arr.length / <span className="text-orange-600 dark:text-orange-300">2</span>)];{"\n"}
                                        {"  "}<span className="text-zinc-500 italic">... // Optimized Logic</span>{"\n"}
                                        {"  "}<span className="text-purple-600 dark:text-purple-400">return</span> [...left, pivot, ...right];{"\n"}
                                        &#125;
                                    </code></pre>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- FEATURE HIGHLIGHTS --- */}
            <section className="border-y bg-muted/30 backdrop-blur-sm relative overflow-hidden">
                <div className="container mx-auto px-6 py-20">
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        <FeatureCard
                            icon={<Zap className="h-6 w-6 text-amber-500" />}
                            title="Lightning Fast"
                            desc="Global shortcuts and optimized edge caching make finding code instantaneous."
                        />
                        <FeatureCard
                            icon={<Shield className="h-6 w-6 text-blue-500" />}
                            title="Enterprise Security"
                            desc="JWT encryption and private-first visibility by default for your secrets."
                        />
                        <FeatureCard
                            icon={<Code2 className="h-6 w-6 text-primary" />}
                            title="Multi-Language"
                            desc="Intelligent syntax highlighting for 17+ modern frameworks and languages."
                        />
                    </motion.div>
                </div>
            </section>

            {/* --- PUBLIC FEED --- */}
            <main id="feed" className="flex-1 container mx-auto p-6 space-y-10 py-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <Terminal className="h-8 w-8 text-primary" />
                            Community Discoveries
                        </h2>
                        <p className="text-muted-foreground max-w-lg">
                            Explore public solutions contributed by engineers worldwide.
                        </p>
                    </div>

                    <div className="relative w-full md:w-80 group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-blue-500/50 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition duration-300" />
                        <div className="relative bg-background rounded-lg">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Filter by language or keyword..."
                                className="pl-10 bg-background border-muted focus-visible:ring-1"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <div key="loading" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex flex-col space-y-3 p-4 border rounded-xl bg-card/50">
                                    <Skeleton className="h-[180px] w-full rounded-lg" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[60%]" />
                                        <Skeleton className="h-4 w-[40%]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            key="content"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {filteredPublicFeed.length > 0 ? (
                                filteredPublicFeed.map((snippet) => (
                                    <motion.div key={snippet.id} variants={itemVariants}>
                                        <SnippetCard snippet={snippet} isReadOnly={true} />
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-24 text-center border-2 border-dashed rounded-3xl bg-muted/20">
                                    <Search className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-xl font-bold">No snippets found</h3>
                                    <p className="text-muted-foreground mt-2">We couldn't find anything matching "{searchQuery}".</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* --- FOOTER --- */}
            <footer className="border-t py-12 px-6 bg-background/50 backdrop-blur-lg">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 font-bold opacity-80">
                        <LayoutDashboard className="h-4 w-4 text-primary" />
                        <span>DevVault</span>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                        © 2026 DevVault Inc. Built for the modern developer.
                    </p>
                    <div className="flex gap-6 text-sm text-muted-foreground font-medium">
                        <Link href="#" className="hover:text-primary">Privacy</Link>
                        <Link href="#" className="hover:text-primary">Terms</Link>
                        <Link href="https://github.com" className="hover:text-primary">GitHub</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <motion.div
            variants={itemVariants}
            className="group relative p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-xl transition-all duration-300"
        >
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-background rounded-2xl shadow-sm border group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <div className="space-y-2">
                    <h3 className="font-bold text-lg tracking-tight">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
            </div>
        </motion.div>
    );
}