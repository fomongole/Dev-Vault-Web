import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { CreateSnippetSchema } from "../schemas";
import { CreateSnippetInput } from "@/types";

export const useCreateSnippet = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateSnippetSchema) => {
            // Convert the comma-separated tags string into an array
            const tagsArray = data.tags
                ? data.tags.split(",").map((t) => t.trim()).filter((t) => t.length > 0)
                : [];

            const payload: CreateSnippetInput = {
                ...data,
                tags: tagsArray,
            };

            const response = await api.post("/snippets", payload);
            return response.data;
        },
        onSuccess: () => {
            // 1. Refresh the 'snippets' list automatically
            queryClient.invalidateQueries({queryKey: ["snippets"]}).then(() => {
                console.log("Successfully created snippet");
            });

            // 2. Close the modal (callback)
            if (onSuccess) onSuccess();
        },
        onError: (error) => {
            console.error("Failed to create snippet:", error);
        },
    });
};