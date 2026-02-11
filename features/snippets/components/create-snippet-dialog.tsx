"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Code, AlertCircle, Sparkles } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SnippetLanguage, SnippetVisibility } from "@/types";
import {createSnippetSchema, CreateSnippetSchema} from "@/features/snippets/schemas";
import {useCreateSnippet} from "@/features/snippets/hooks/use-create-snippet";

export function CreateSnippetDialog() {
    const [open, setOpen] = useState(false);

    const form = useForm<CreateSnippetSchema>({
        resolver: zodResolver(createSnippetSchema),
        defaultValues: {
            title: "",
            code: "",
            language: SnippetLanguage.TYPESCRIPT,
            visibility: SnippetVisibility.PRIVATE,
            tags: "",
        },
    });

    const { mutate: createSnippet, isPending } = useCreateSnippet(() => {
        setOpen(false); // Close modal on success
        form.reset();   // Clear form
    });

    const onSubmit = (data: CreateSnippetSchema) => {
        createSnippet(data);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, onChange: (value: string) => void) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const target = e.target as HTMLTextAreaElement;
            const start = target.selectionStart;
            const end = target.selectionEnd;
            const value = target.value;

            // Insert 2 spaces for tab
            const newValue = value.substring(0, start) + "  " + value.substring(end);

            // Update form state manually
            onChange(newValue);

            // Move cursor forward
            requestAnimationFrame(() => {
                target.selectionStart = target.selectionEnd = start + 2;
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="shadow-md">
                    <Plus className="mr-2 h-4 w-4" /> New Snippet
                </Button>
            </DialogTrigger>
            {/* Layout: Flex Column with Fixed Height & Overflow Hidden to manage internal scrolling */}
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">

                {/* Fixed Header */}
                <DialogHeader className="p-6 pb-4 border-b bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Code className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle>Create Snippet</DialogTitle>
                            <DialogDescription>
                                Add a new code solution to your vault.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <Form {...form}>
                        <form id="create-snippet-form" onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">

                            {/* Title */}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold">Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Quick Sort Algorithm" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Language & Visibility (Side by Side) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                            {/* Code Editor Area */}
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold flex justify-between">
                                            <span>Code Source</span>
                                            <span className="text-xs text-muted-foreground font-normal">Press Tab to indent</span>
                                        </FormLabel>
                                        <FormControl>
                                            <div className="rounded-md border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-ring">
                                                <Textarea
                                                    {...field}
                                                    onKeyDown={(e) => handleKeyDown(e, field.onChange)}
                                                    placeholder="// Paste your code here..."
                                                    className="font-mono text-sm min-h-[300px] resize-y border-0 rounded-none bg-zinc-950 text-zinc-100 p-4 focus-visible:ring-0 leading-relaxed"
                                                    spellCheck={false}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Tags */}
                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold">Tags (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="react, hooks, auth" {...field} />
                                        </FormControl>
                                        <FormDescription className="flex items-center gap-1.5 text-xs">
                                            <AlertCircle className="h-3 w-3" />
                                            Separate tags with commas.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </div>

                {/* Fixed Footer */}
                <div className="p-4 border-t bg-zinc-50 dark:bg-zinc-900 flex justify-end gap-3 z-10">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setOpen(false)}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="create-snippet-form" // Connects to the form ID
                        disabled={isPending}
                        className="min-w-[140px]"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" /> Create Snippet
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}