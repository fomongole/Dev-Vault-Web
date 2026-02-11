"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import Link from "next/link";
import {
    Calendar,
    Code2,
    Globe,
    Lock,
    MoreHorizontal,
    Trash2,
    Pencil,
    Loader2,
    Star,
    Copy,
    Check,
    ChevronRight
} from "lucide-react";

import { Snippet } from "@/types";
import { useDeleteSnippet } from "../hooks/use-delete-snippet";
import { useTogglePin } from "../hooks/use-toggle-pin";
import { CodeViewer } from "@/components/ui/code-viewer";
import { EditSnippetDialog } from "./edit-snippet-dialog";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function SnippetCard({ snippet, isReadOnly = false }: { snippet: Snippet; isReadOnly?: boolean }) {
    const [hasCopied, setHasCopied] = useState(false);
    const { mutate: deleteSnippet } = useDeleteSnippet();
    const { mutate: togglePin, isPending: isPinning } = useTogglePin();

    const handleCopy = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        await navigator.clipboard.writeText(snippet.code);
        setHasCopied(true);
        toast.success("Code copied");
        setTimeout(() => setHasCopied(false), 2000);
    };

    return (
        <Card className="group flex flex-col h-[340px] bg-zinc-50/50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all overflow-hidden shadow-sm hover:shadow-md">

            {/* 1. Header Section: Pure Metadata */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 shrink-0">
                        <Code2 className="h-4 w-4 text-zinc-500" />
                    </div>
                    {/* The Title: Fully protected by flex-1 and truncate */}
                    <h3 className="font-semibold text-sm truncate text-zinc-900 dark:text-zinc-100">
                        {snippet.title}
                    </h3>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-4">
                    {!isReadOnly && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-8 w-8", snippet.isPinned && "text-amber-500")}
                            onClick={(e) => { e.preventDefault(); togglePin({ id: snippet.id, isPinned: !snippet.isPinned }); }}
                        >
                            {isPinning ? <Loader2 className="h-3 w-3 animate-spin" /> : <Star className={cn("h-4 w-4", snippet.isPinned && "fill-current")} />}
                        </Button>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleCopy}><Copy className="mr-2 h-4 w-4" /> Copy Code</DropdownMenuItem>
                            {!isReadOnly && (
                                <>
                                    <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* 2. Content Section: Interactive Preview */}
            <div className="relative flex-1 overflow-hidden group/code">
                <Link href={`/snippets/${snippet.id}`} className="absolute inset-0 z-10" />

                <CodeViewer
                    code={snippet.code}
                    language={snippet.language}
                    className="h-full w-full rounded-none border-none text-xs"
                    hideCopyButton={true}
                />

                {/* Bottom Overlay: Fade + Stats */}
                <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-zinc-50 dark:from-zinc-950 to-transparent pointer-events-none z-20" />

                {/* Float Action: Copy Button appears on hover over code */}
                <Button
                    onClick={handleCopy}
                    size="sm"
                    className="absolute top-3 right-3 z-30 opacity-0 group-hover/code:opacity-100 transition-opacity bg-white/90 dark:bg-zinc-800/90 text-zinc-900 dark:text-zinc-100 shadow-sm border border-zinc-200 dark:border-zinc-700"
                >
                    {hasCopied ? <Check className="h-3.5 w-3.5 mr-2 text-green-500" /> : <Copy className="h-3.5 w-3.5 mr-2" />}
                    {hasCopied ? "Copied" : "Copy"}
                </Button>
            </div>

            {/* 3. Footer Section: Status & Navigation */}
            <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-medium uppercase tracking-wider">
                        {snippet.visibility === "public" ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                        {snippet.language}
                    </div>
                </div>

                <Link
                    href={`/snippets/${snippet.id}`}
                    className="flex items-center gap-1 text-[11px] font-bold text-primary hover:underline z-30"
                >
                    VIEW FULL
                    <ChevronRight className="h-3 w-3" />
                </Link>
            </div>
        </Card>
    );
}