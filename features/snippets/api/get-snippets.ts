import { api } from "@/lib/axios";
import { Snippet, PaginatedResponse } from "@/types";

export const getSnippets = async (page = 1, limit = 50): Promise<PaginatedResponse<Snippet>> => {
    const response = await api.get<PaginatedResponse<Snippet>>("/snippets", {
        params: { page, limit }
    });
    return response.data;
};