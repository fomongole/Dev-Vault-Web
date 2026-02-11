import {PaginatedResponse, Snippet} from "@/types";
import {api} from "@/lib/axios";

export const getPublicSnippets = async (page = 1, limit = 50): Promise<PaginatedResponse<Snippet>> => {
    const response = await api.get<PaginatedResponse<Snippet>>("/snippets/public", {
        params: { page, limit }
    });
    return response.data;
};