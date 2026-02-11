import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export const useDeleteSnippet = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/snippets/${id}`);
        },
        onSuccess: () => {
            // Refresh the list immediately after deletion
            queryClient.invalidateQueries({ queryKey: ["snippets"] }).then(() => {
                console.log("Successfully deleted");
            });
        },
        onError: (error) => {
            console.error("Failed to delete snippet:", error);
        },
    });
};