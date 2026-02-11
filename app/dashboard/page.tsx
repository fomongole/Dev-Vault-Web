"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useSnippets } from "@/features/snippets/hooks/use-snippets";
import { SnippetCard } from "@/features/snippets/components/snippet-card";
import { DashboardStats } from "@/features/snippets/components/dashboard-stats";
import { Search, X, Filter, FolderOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { SnippetLanguage } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateSnippetDialog } from "@/features/snippets/components/create-snippet-dialog";

export default function DashboardPage() {
    const { data: snippetsResponse, isLoading, isError, page, setPage } = useSnippets();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
    const searchInputRef = useRef<HTMLInputElement>(null);

    const snippets = snippetsResponse?.data || [];
    const meta = snippetsResponse?.meta;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const filteredSnippets = useMemo(() => {
        if (!snippets) return [];
        return snippets.filter((snippet) => {
            const matchesSearch =
                snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                snippet.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesLanguage =
                selectedLanguage === "all" || snippet.language === selectedLanguage;
            return matchesSearch && matchesLanguage;
        });
    }, [snippets, searchQuery, selectedLanguage]);

    const { pinned, others } = useMemo(() => {
        return {
            pinned: filteredSnippets.filter(s => s.isPinned),
            others: filteredSnippets.filter(s => !s.isPinned)
        };
    }, [filteredSnippets]);

    const resetFilters = () => {
        setSearchQuery("");
        setSelectedLanguage("all");
    };

    if (isLoading) return <DashboardSkeleton />;

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4 text-center">
                <div className="p-4 bg-destructive/10 rounded-full">
                    <Filter className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="text-lg font-semibold">Failed to load snippets</h3>
                <Button onClick={() => window.location.reload()} variant="outline">Retry</Button>
            </div>
        );
    }

    // Zero State (Empty Vault)
    if (snippets.length === 0 && !searchQuery && selectedLanguage === "all") {
        return <EmptyDashboardState />;
    }

    return (
        <div className="space-y-8 pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Manage and organize your code library.</p>
                </div>
            </div>

            <DashboardStats snippets={snippets} />

            {/* Controls */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur py-4 border-b">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            ref={searchInputRef}
                            placeholder="Search snippets... (⌘K)"
                            className="pl-10 pr-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Languages</SelectItem>
                                {Object.values(SnippetLanguage).map((lang) => (
                                    <SelectItem key={lang} value={lang} className="capitalize">{lang}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {(searchQuery || selectedLanguage !== "all") && (
                            <Button variant="ghost" size="icon" onClick={resetFilters} title="Reset filters">
                                <Filter className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-10">
                {filteredSnippets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="p-4 bg-muted rounded-full"><Search className="h-8 w-8 text-muted-foreground" /></div>
                        <div>
                            <h3 className="text-lg font-semibold">No results found</h3>
                            <p className="text-muted-foreground">Adjust filters to find what you're looking for.</p>
                        </div>
                        <Button variant="outline" onClick={resetFilters}>Clear Filters</Button>
                    </div>
                ) : (
                    <>
                        {pinned.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pinned</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {pinned.map((snippet) => <SnippetCard key={snippet.id} snippet={snippet} />)}
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            {pinned.length > 0 && <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Recent</h3>}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {others.map((snippet) => <SnippetCard key={snippet.id} snippet={snippet} />)}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {meta && meta.lastPage > 1 && (
                <div className="flex items-center justify-center gap-4 pt-8 border-t">
                    <Button
                        variant="outline"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                    </Button>
                    <span className="text-sm font-medium">
                        Page {meta.page} of {meta.lastPage}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => setPage((p) => Math.min(meta.lastPage, p + 1))}
                        disabled={page === meta.lastPage}
                    >
                        Next <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            )}
        </div>
    );
}

function EmptyDashboardState() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="p-6 bg-primary/5 rounded-full ring-1 ring-primary/20">
                <FolderOpen className="h-12 w-12 text-primary" />
            </div>
            <div className="max-w-md space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Your vault is empty</h2>
                <p className="text-muted-foreground">Create your first code snippet to start building your personal library.</p>
            </div>
            <div className="pt-2"><CreateSnippetDialog /></div>
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-8 pb-20">
            <div className="space-y-2"><Skeleton className="h-10 w-48" /><Skeleton className="h-5 w-96" /></div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{[1,2,3,4].map(i=><Skeleton key={i} className="h-32 rounded-xl" />)}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[1,2,3,4,5,6].map(i=><Skeleton key={i} className="h-[280px] rounded-xl" />)}</div>
        </div>
    );
}