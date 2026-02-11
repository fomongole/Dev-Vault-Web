import { z } from "zod";
import { SnippetLanguage, SnippetVisibility } from "@/types";

export const createSnippetSchema = z.object({
    title: z.string().min(1, "Title is required").max(100),
    code: z.string().min(1, "Code is required"),
    language: z.nativeEnum(SnippetLanguage),
    visibility: z.nativeEnum(SnippetVisibility),
    // We accept tags as a comma-separated string from the UI,
    // then convert it to an array for the API.
    tags: z.string().optional(),
});

export type CreateSnippetSchema = z.infer<typeof createSnippetSchema>;