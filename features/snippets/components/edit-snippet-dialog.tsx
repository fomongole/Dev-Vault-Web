"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle, Code, Save, AlertTriangle } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { createSnippetSchema, CreateSnippetSchema } from "../schemas";
import { useUpdateSnippet } from "../hooks/use-update-snippet";
import { Snippet, SnippetLanguage, SnippetVisibility } from "@/types";

interface EditSnippetDialogProps {
    snippet: Snippet;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditSnippetDialog({ snippet, open, onOpenChange }: EditSnippetDialogProps) {
    const [showExitWarning, setShowExitWarning] = useState(false);

    const form = useForm<CreateSnippetSchema>({
        resolver: zodResolver(createSnippetSchema),
        defaultValues: {
            title: snippet.title,
            code: snippet.code,
            language: snippet.language,
            visibility: snippet.visibility,
            tags: snippet.tags ? snippet.tags.join(", ") : "",
        },
    });

    const { isDirty } = form.formState;

    useEffect(() => {
        if (open) {
            form.reset({
                title: snippet.title,
                code: snippet.code,
                language: snippet.language,
                visibility: snippet.visibility,
                tags: snippet.tags ? snippet.tags.join(", ") : "",
            });
        }
    }, [snippet, form, open]);

    const { mutate: updateSnippet, isPending } = useUpdateSnippet(() => {
        onOpenChange(false);
        form.reset();
    });

    const handleRequestClose = () => {
        if (isDirty) {
            setShowExitWarning(true);
        } else {
            onOpenChange(false);
        }
    };

    const confirmExit = () => {
        setShowExitWarning(false);
        onOpenChange(false);
        form.reset();
    };

    const onSubmit = (data: CreateSnippetSchema) => {
        const tagsArray = data.tags
            ? data.tags.split(",").map((t) => t.trim()).filter((t) => t.length > 0)
            : [];

        updateSnippet({
            id: snippet.id,
            data: { ...data, tags: tagsArray },
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, onChange: (value: string) => void) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const target = e.target as HTMLTextAreaElement;
            const start = target.selectionStart;
            const end = target.selectionEnd;
            const value = target.value;

            const newValue = value.substring(0, start) + "  " + value.substring(end);
            onChange(newValue);

            requestAnimationFrame(() => {
                target.selectionStart = target.selectionEnd = start + 2;
            });
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={handleRequestClose}>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
                    <DialogHeader className="p-6 pb-4 border-b bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                <Code className="h-5 w-5 text-primary" />
                                Edit Snippet
                            </DialogTitle>
                            {isDirty && <Badge variant="secondary" className="text-xs animate-pulse">Unsaved Changes</Badge>}
                        </div>
                        <DialogDescription>
                            Make changes to your snippet. Press <kbd className="px-1 py-0.5 rounded bg-muted text-muted-foreground text-[10px] border">Tab</kbd> to indent code.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <Form {...form}>
                            <form id="edit-snippet-form" onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem className="col-span-1 md:col-span-2">
                                                <FormLabel className="font-semibold">Title</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. Binary Search Implementation"
                                                        className="font-medium"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="language"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-semibold">Language</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select language" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {Object.values(SnippetLanguage).map((lang) => (
                                                            <SelectItem key={lang} value={lang} className="capitalize">
                                                                {lang}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="visibility"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-semibold">Visibility</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select visibility" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value={SnippetVisibility.PRIVATE}>Private (Only you)</SelectItem>
                                                        <SelectItem value={SnippetVisibility.PUBLIC}>Public (Community)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex justify-between items-center font-semibold">
                                                <span>Code Source</span>
                                                <span className="text-xs text-muted-foreground font-normal">
                                                    {field.value.length} characters
                                                </span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative rounded-md border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-ring">
                                                    <Textarea
                                                        {...field}
                                                        onKeyDown={(e) => handleKeyDown(e, field.onChange)}
                                                        className="font-mono text-sm min-h-[300px] resize-y border-0 rounded-none bg-zinc-950 text-zinc-100 p-4 focus-visible:ring-0 leading-relaxed"
                                                        placeholder="// Paste your code here..."
                                                        spellCheck={false}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="tags"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Tags</FormLabel>
                                            <FormControl>
                                                <Input placeholder="react, hooks, performance" {...field} />
                                            </FormControl>
                                            <FormDescription className="flex items-center gap-1.5 text-xs italic">
                                                <AlertCircle className="h-3 w-3" />
                                                Separate tags with commas. e.g. &#34;typescript, api, auth&#34;
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </Form>
                    </div>

                    <div className="p-4 border-t bg-zinc-50 dark:bg-zinc-900 flex justify-end gap-3 z-10">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleRequestClose}
                            className="text-muted-foreground hover:text-foreground"
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            form="edit-snippet-form"
                            disabled={isPending || !isDirty}
                            className="min-w-[140px] shadow-lg shadow-primary/20"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving Changes...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" /> Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showExitWarning} onOpenChange={setShowExitWarning}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 mb-2">
                            <AlertTriangle className="h-5 w-5" />
                            <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
                        </div>
                        <AlertDialogDescription>
                            You have made changes to this snippet that haven&apos;t been saved yet.
                            Leaving now will lose all modifications.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Keep Editing</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmExit}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Discard Changes
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}