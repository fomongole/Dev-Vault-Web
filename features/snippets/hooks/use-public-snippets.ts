import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {getPublicSnippets} from "@/features/snippets/api/get-public-snippets";
import {useState} from "react";

export const usePublicSnippets = () => {
    const [page, setPage] = useState(1);

    const queryInfo = useQuery({
        queryKey: ["public-snippets", page],
        queryFn: () => getPublicSnippets(page),
        placeholderData: keepPreviousData,
    });

    return { ...queryInfo, page, setPage };
};