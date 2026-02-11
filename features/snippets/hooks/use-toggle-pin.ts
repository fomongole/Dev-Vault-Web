import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export const useTogglePin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, isPinned }: { id: string; isPinned: boolean }) => {
            const response = await api.patch(`/snippets/${id}`, { isPinned });
            return response.data;
        },
        onSuccess: (_, variables) => {
            // Refresh snippets list to trigger the re-sort logic
            queryClient.invalidateQueries({ queryKey: ["snippets"] });
            toast.success(variables.isPinned ? "Pinned to top" : "Unpinned");
        },
        onError: () => {
            toast.error("Failed to update pin status");
        },
    });
};