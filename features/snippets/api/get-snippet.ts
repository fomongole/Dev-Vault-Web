import { api } from "@/lib/axios";
import { Snippet } from "@/types";

export const getSnippet = async (id: string): Promise<Snippet> => {
    const response = await api.get<Snippet>(`/snippets/${id}`);
    return response.data;
};