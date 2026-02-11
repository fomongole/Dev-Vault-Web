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
    MoreVertical,
    Trash2,
    Pencil,
    Loader2,
    Star,
    Copy,
    Check
} from "lucide-react";

import { Snippet } from "@/types";
import { useDeleteSnippet } from "../hooks/use-delete-snippet";
import { useTogglePin } from "../hooks/use-toggle-pin";
import { CodeViewer } from "@/components/ui/code-viewer";
import { EditSnippetDialog } from "./edit-snippet-dialog";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
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
import { cn } from "@/lib/utils";

interface SnippetCardProps {
    snippet: Snippet;
    isReadOnly?: boolean;
}

export function SnippetCard({ snippet, isReadOnly = false }: SnippetCardProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [hasCopied, setHasCopied] = useState(false);

    const { mutate: deleteSnippet, isPending: isDeleting } = useDeleteSnippet();

    const { mutate: togglePin, isPending: isPinning } = useTogglePin();

    const isPublic = snippet.visibility === "public";

    const handleQuickCopy = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(snippet.code);
            setHasCopied(true);
            toast.success("Code copied");
            setTimeout(() => setHasCopied(false), 2000);
        } catch (err) {
            toast.error("Failed to copy");
        }
    };

    const handleTogglePin = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // Optimistic UI handled by React Query cache, but loading state handles the visual feedback
        togglePin({ id: snippet.id, isPinned: !snippet.isPinned });
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        deleteSnippet(snippet.id, {
            onSuccess: () => {
                setShowDeleteDialog(false);
                toast.success("Snippet deleted");
            },
            onError: () => toast.error("Failed to delete"),
        });
    };

    return (
        <>
            <Card className={cn(
                "group relative flex flex-col justify-between transition-all duration-300",
                "hover:shadow-lg hover:-translate-y-1",
                snippet.isPinned
                    ? "border-amber-500/50 bg-amber-500/[0.02]"
                    : "hover:border-zinc-400 dark:hover:border-zinc-500"
            )}>
                <Link
                    href={`/snippets/${snippet.id}`}
                    className="absolute inset-0 z-0 focus:outline-none"
                    aria-label={`View snippet: ${snippet.title}`}
                >
                    <span className="sr-only">View {snippet.title}</span>
                </Link>

                {!isReadOnly && (
                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={handleTogglePin}
                        disabled={isPinning}
                        className={cn(
                            "absolute -top-3 -left-3 h-8 w-8 rounded-full border shadow-md z-20 transition-all duration-200 flex items-center justify-center",
                            snippet.isPinned
                                ? "opacity-100 scale-100 text-amber-500 border-amber-200 bg-amber-50 dark:bg-amber-950/30"
                                : "opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 text-zinc-400 bg-background",
                            // Keep visible if loading
                            isPinning && "opacity-100 scale-100"
                        )}
                        title={snippet.isPinned ? "Unpin snippet" : "Pin to top"}
                    >
                        {isPinning ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                        ) : (
                            <Star className={cn("h-4 w-4", snippet.isPinned && "fill-current")} />
                        )}
                    </Button>
                )}

                <CardHeader className="pb-2 relative z-10">
                    <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-2 min-w-0 pl-2">
                            <CardTitle className="text-base font-bold truncate leading-none">
                                {snippet.title}
                            </CardTitle>
                            {isPublic ? (
                                <Globe className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                            ) : (
                                <Lock className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                            )}
                        </div>

                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleQuickCopy}
                                className={cn(
                                    "h-8 w-8 transition-opacity z-10",
                                    "opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                                )}
                            >
                                {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </Button>

                            {!isReadOnly && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className={cn(
                                                "h-8 w-8 p-0 transition-opacity z-10 relative",
                                                "opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                                            )}
                                        >
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                                            <Pencil className="mr-2 h-4 w-4" /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-red-600 focus:text-red-600"
                                            onClick={() => setShowDeleteDialog(true)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pb-2 flex-grow space-y-3 relative z-0">
                    <div className="bg-zinc-950 rounded-lg border border-zinc-800 relative h-40 overflow-hidden group-hover:border-zinc-700 transition-colors pointer-events-none">
                        <CodeViewer
                            code={snippet.code}
                            language={snippet.language}
                            className="h-full text-[13px]"
                        />
                        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
                    </div>

                    {snippet.tags && snippet.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 min-h-[24px]">
                            {snippet.tags.map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="outline"
                                    className="text-[10px] font-mono bg-zinc-100/50 dark:bg-zinc-800/50 px-1.5 py-0"
                                >
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex justify-between items-center text-[11px] text-muted-foreground pt-3 border-t bg-zinc-50/50 dark:bg-zinc-900/50 rounded-b-xl relative z-10">
                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                        <Code2 className="h-3.5 w-3.5" />
                        <span className="capitalize">{snippet.language}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{format(new Date(snippet.createdAt), "MMM d, yyyy")}</span>
                    </div>
                </CardFooter>
            </Card>

            {!isReadOnly && (
                <>
                    <EditSnippetDialog
                        snippet={snippet}
                        open={showEditDialog}
                        onOpenChange={setShowEditDialog}
                    />
                    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Snippet</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete <strong>&#34;{snippet.title}&#34;</strong>?
                                    <br />
                                    This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Delete Snippet"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            )}
        </>
    );
}