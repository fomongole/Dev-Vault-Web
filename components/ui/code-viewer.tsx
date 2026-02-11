"use client";

import { useState, useMemo, useEffect } from "react";
import { Check, Copy, Terminal, Loader2 } from "lucide-react";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface CodeViewerProps {
    code: string;
    language: string;
    className?: string;
    hideCopyButton?: boolean;
    maxHeight?: string;
}

export function CodeViewer({
                               code,
                               language,
                               className,
                               hideCopyButton = false,
                               maxHeight
                           }: CodeViewerProps) {
    const [isCopied, setIsCopied] = useState(false);
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const copyToClipboard = async () => {
        if (!code) return;
        try {
            await navigator.clipboard.writeText(code);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    // Refined Theme Selection with background overrides
    const activeStyle = useMemo(() => {
        const theme = resolvedTheme === "dark" ? oneDark : oneLight;
        if (!mounted) return oneDark;

        // We spread the theme and explicitly set the background to transparent
        // to prevent weird gray blocks
        return {
            ...theme,
            'pre[class*="language-"]': {
                ...theme['pre[class*="language-"]'],
                background: "transparent",
            },
            'code[class*="language-"]': {
                ...theme['code[class*="language-"]'],
                background: "transparent",
            },
        };
    }, [resolvedTheme, mounted]);

    const safeLanguage = useMemo(() => {
        const langMap: Record<string, string> = {
            tsx: "tsx", typescript: "typescript", javascript: "javascript",
            python: "python", java: "java", csharp: "csharp", go: "go",
            rust: "rust", swift: "swift", kotlin: "kotlin", dart: "dart",
            sql: "sql", html: "markup", xml: "markup", css: "css",
            json: "json", yaml: "yaml", shell: "bash", bash: "bash",
        };
        return langMap[language?.toLowerCase()] || "typescript";
    }, [language]);

    if (!mounted) return null;

    return (
        <div className={cn(
            "group relative flex flex-col rounded-xl overflow-hidden border transition-all duration-300",
            "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0d0d0e] shadow-sm font-mono",
            className
        )}>
            {/* Window Header */}
            <div className={cn(
                "flex items-center justify-between px-4 py-2.5 select-none border-b transition-colors",
                "bg-zinc-50/80 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800/50"
            )}>
                <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
                        <div className="h-2.5 w-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500/20 border border-green-500/40" />
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500">
                        <Terminal className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{safeLanguage}</span>
                    </div>
                </div>

                {!hideCopyButton && (
                    <button
                        onClick={copyToClipboard}
                        className={cn(
                            "flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold transition-all",
                            "hover:bg-zinc-200/50 dark:hover:bg-zinc-800 active:scale-95",
                            isCopied ? "text-green-600 dark:text-green-400" : "text-zinc-500 dark:text-zinc-400"
                        )}
                    >
                        {isCopied ? (
                            <>
                                <Check className="h-3 w-3 stroke-[3px]" />
                                <span>COPIED</span>
                            </>
                        ) : (
                            <>
                                <Copy className="h-3 w-3" />
                                <span>COPY</span>
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Code Body */}
            <div
                className={cn(
                    "overflow-auto relative bg-transparent",
                    "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-800"
                )}
                style={{ maxHeight: maxHeight || "none" }}
            >
                <SyntaxHighlighter
                    language={safeLanguage}
                    style={activeStyle}
                    showLineNumbers={true}
                    PreTag={({ children }) => <pre className="m-0 bg-transparent">{children}</pre>}
                    loading={
                        <div className="flex items-center justify-center p-12">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    }
                    lineNumberStyle={{
                        minWidth: "3.2em",
                        paddingRight: "1.2em",
                        color: resolvedTheme === "dark" ? "#3b3b3f" : "#9ca3af",
                        textAlign: "right",
                        fontSize: "11px",
                        userSelect: "none",
                    }}
                    customStyle={{
                        margin: 0,
                        padding: "1.5rem 0.5rem",
                        fontSize: "13px",
                        lineHeight: "1.7",
                        background: "transparent",
                    }}
                    wrapLongLines={false}
                >
                    {(code || "").trim()}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}