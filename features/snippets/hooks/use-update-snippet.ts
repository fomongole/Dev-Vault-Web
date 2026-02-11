import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { CreateSnippetInput } from "@/types";
import { toast } from "sonner";

type UpdateParams = {
    id: string;
    data: Partial<CreateSnippetInput>;
};

export const useUpdateSnippet = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: UpdateParams) => {
            // We return the response so we could potentially use it to update cache manually if needed
            const response = await api.patch(`/snippets/${id}`, data);
            return response.data;
        },
        // We accept 'variables' here to access the 'id' that was just updated
        onSuccess: (_, variables) => {
            // 1. Refresh the general list (for the Dashboard)
            queryClient.invalidateQueries({ queryKey: ["snippets"] });

            // 2. Refresh the specific snippet detail view immediately
            queryClient.invalidateQueries({ queryKey: ["snippet", variables.id] });

            toast.success("Snippet updated successfully");
            if (onSuccess) onSuccess();
        },
        onError: () => {
            toast.error("Failed to update snippet");
        },
    });
};