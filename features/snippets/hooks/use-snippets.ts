import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getSnippets } from "../api/get-snippets";
import { useState } from "react";

export const useSnippets = () => {
    const [page, setPage] = useState(1);

    const queryInfo = useQuery({
        queryKey: ["snippets", page],
        queryFn: () => getSnippets(page),
        placeholderData: keepPreviousData,
    });

    return { ...queryInfo, page, setPage };
};