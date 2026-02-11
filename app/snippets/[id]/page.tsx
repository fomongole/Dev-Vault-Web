"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
    ArrowLeft,
    Calendar,
    User as UserIcon,
    Globe,
    Lock,
    Pencil,
    Trash2,
    Loader2,
    Share2,
    Check,
    Download,
    AlertTriangle,
    Ban
} from "lucide-react";

import { getSnippet } from "@/features/snippets/api/get-snippet";
import { CodeViewer } from "@/components/ui/code-viewer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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

import { EditSnippetDialog } from "@/features/snippets/components/edit-snippet-dialog";
import { useDeleteSnippet } from "@/features/snippets/hooks/use-delete-snippet";
import { getUserIdFromToken } from "@/features/auth/utils/auth";
import Link from "next/link";
import { AxiosError } from "axios";

export default function SnippetDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [isOwner, setIsOwner] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [copied, setCopied] = useState(false);

    const { data: snippet, isLoading, isError, error } = useQuery({
        queryKey: ["snippet", id],
        queryFn: () => getSnippet(id as string),
        retry: 1, // Don't retry endlessly if it's a 403/404
    });

    const { mutate: deleteSnippet, isPending: isDeleting } = useDeleteSnippet();

    useEffect(() => {
        if (snippet) {
            const currentUserId = getUserIdFromToken();
            if (currentUserId && snippet.user.id === currentUserId) {
                setIsOwner(true);
            }
        }
    }, [snippet]);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            toast.success("Link copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Failed to copy link");
        }
    };

    const handleDownload = () => {
        if (!snippet) return;
        const blob = new Blob([snippet.code], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${snippet.title.replace(/\s+/g, "_")}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDelete = () => {
        deleteSnippet(snippet!.id, {
            onSuccess: () => {
                toast.success("Snippet deleted successfully");
                router.push("/dashboard");
            },
            onError: () => toast.error("Failed to delete snippet")
        });
    };

    // 1. Loading State
    if (isLoading) return <SnippetDetailSkeleton />;

    // 2.Handle 403/401 separately from 404
    if (isError) {
        const axiosError = error as AxiosError;
        const status = axiosError.response?.status;
        const isLoggedIn = !!getUserIdFromToken(); // Check auth status

        // Case A: Forbidden / Unauthorized (Private Snippet)
        if (status === 403 || status === 401) {
            return (
                <div className="flex h-[80vh] flex-col items-center justify-center gap-6 text-center px-4">
                    <div className="p-4 bg-amber-100 dark:bg-amber-900/20 rounded-full ring-1 ring-amber-200 dark:ring-amber-800">
                        {isLoggedIn ? (
                            <Ban className="h-10 w-10 text-red-600 dark:text-red-500" />
                        ) : (
                            <Lock className="h-10 w-10 text-amber-600 dark:text-amber-500" />
                        )}
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">
                            {isLoggedIn ? "Access Denied" : "Private Snippet"}
                        </h2>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            {isLoggedIn
                                ? "You are logged in, but you do not have permission to view this private snippet. It belongs to another user."
                                : "This snippet is private. If you are the owner, please log in to view it."
                            }
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <Button variant="outline" onClick={() => router.back()}>
                            Go Back
                        </Button>

                        {/* Only show Login button if NOT logged in */}
                        {!isLoggedIn && (
                            <Button onClick={() => router.push(`/login?redirect=/snippets/${id}`)}>
                                Log In to Access
                            </Button>
                        )}

                        {/* If logged in but blocked, show Dashboard link */}
                        {isLoggedIn && (
                            <Button onClick={() => router.push("/dashboard")}>
                                Return to Dashboard
                            </Button>
                        )}
                    </div>
                </div>
            );
        }

        // Case B: Truly Not Found (404)
        return (
            <div className="flex h-[80vh] flex-col items-center justify-center gap-6 text-center px-4">
                <div className="p-4 bg-muted rounded-full">
                    <AlertTriangle className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Snippet Not Found</h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        The snippet you are looking for does not exist or has been deleted.
                    </p>
                </div>
                <Button asChild variant="default">
                    <Link href="/dashboard">Return to Dashboard</Link>
                </Button>
            </div>
        );
    }

    if (!snippet) return null;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20">
            {/* Header and Content Layout */}
            <div className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-md px-6 py-4 transition-all">
                <div className="container mx-auto flex items-center justify-between">
                    <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full border">
                            {snippet.visibility === "public" ?
                                <Globe className="h-3.5 w-3.5 text-blue-500" /> :
                                <Lock className="h-3.5 w-3.5 text-zinc-500" />
                            }
                            <span className="text-xs font-medium capitalize text-muted-foreground">
                                {snippet.visibility}
                            </span>
                        </div>

                        {snippet.visibility === "public" && (
                            <Button variant="outline" size="sm" onClick={handleCopyLink}>
                                {copied ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Share2 className="h-4 w-4 mr-2" />}
                                {copied ? "Copied" : "Share"}
                            </Button>
                        )}

                        {isOwner && (
                            <div className="flex items-center gap-2 ml-2 border-l pl-4 border-border">
                                <Button size="sm" variant="outline" onClick={() => setShowEditDialog(true)}>
                                    <Pencil className="h-4 w-4 mr-2" /> Edit
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <main className="container mx-auto grid grid-cols-1 gap-8 p-6 lg:grid-cols-4 mt-6">
                <div className="lg:col-span-3 space-y-4">
                    <div className="rounded-xl border bg-zinc-950 shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3 bg-zinc-900/50">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                                </div>
                                <span className="ml-4 text-xs font-mono text-zinc-400 uppercase tracking-widest font-semibold">
                                    {snippet.language}
                                </span>
                            </div>
                        </div>
                        <CodeViewer
                            code={snippet.code}
                            language={snippet.language}
                            hideCopyButton={false}
                            maxHeight="800px"
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-4">
                        <h1 className="text-3xl font-extrabold tracking-tight leading-tight break-words">
                            {snippet.title}
                        </h1>
                        <div className="flex flex-wrap gap-2">
                            {snippet.tags?.map(tag => (
                                <Badge key={tag} variant="secondary" className="px-2 py-0.5 text-xs font-mono">
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="p-5 rounded-xl bg-card border shadow-sm space-y-5">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <UserIcon className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Author</p>
                                    <p className="font-semibold text-foreground">{snippet.user.fullName || "Anonymous"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <Calendar className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Created</p>
                                    <p className="font-semibold text-foreground">{format(new Date(snippet.createdAt), "PPP")}</p>
                                </div>
                            </div>
                        </div>

                        <Button className="w-full" variant="secondary" onClick={handleDownload}>
                            <Download className="h-4 w-4 mr-2" /> Download Source
                        </Button>
                    </div>
                </div>
            </main>

            {isOwner && (
                <>
                    <EditSnippetDialog
                        snippet={snippet}
                        open={showEditDialog}
                        onOpenChange={setShowEditDialog}
                    />

                    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the
                                    <span className="font-bold text-foreground"> "{snippet.title}" </span>
                                    snippet and remove it from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDelete();
                                    }}
                                    disabled={isDeleting}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                    Delete Snippet
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            )}
        </div>
    );
}

function SnippetDetailSkeleton() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <div className="border-b px-6 py-4">
                <div className="container mx-auto flex justify-between">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-32" />
                </div>
            </div>
            <main className="container mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 p-6 mt-6">
                <div className="lg:col-span-3">
                    <Skeleton className="h-[500px] w-full rounded-xl" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-10 w-3/4" />
                    <div className="flex gap-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                    </div>
                    <Skeleton className="h-40 w-full rounded-xl" />
                </div>
            </main>
        </div>
    );
}