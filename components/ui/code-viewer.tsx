"use client";

import { useState, useMemo } from "react";
import { Check, Copy } from "lucide-react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import java from "react-syntax-highlighter/dist/esm/languages/prism/java";
import csharp from "react-syntax-highlighter/dist/esm/languages/prism/csharp";
import go from "react-syntax-highlighter/dist/esm/languages/prism/go";
import rust from "react-syntax-highlighter/dist/esm/languages/prism/rust";
import swift from "react-syntax-highlighter/dist/esm/languages/prism/swift";
import kotlin from "react-syntax-highlighter/dist/esm/languages/prism/kotlin";
import dart from "react-syntax-highlighter/dist/esm/languages/prism/dart";
import sql from "react-syntax-highlighter/dist/esm/languages/prism/sql";
import markup from "react-syntax-highlighter/dist/esm/languages/prism/markup";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import yaml from "react-syntax-highlighter/dist/esm/languages/prism/yaml";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("csharp", csharp);
SyntaxHighlighter.registerLanguage("go", go);
SyntaxHighlighter.registerLanguage("rust", rust);
SyntaxHighlighter.registerLanguage("swift", swift);
SyntaxHighlighter.registerLanguage("kotlin", kotlin);
SyntaxHighlighter.registerLanguage("dart", dart);
SyntaxHighlighter.registerLanguage("sql", sql);
SyntaxHighlighter.registerLanguage("html", markup);
SyntaxHighlighter.registerLanguage("xml", markup);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("yaml", yaml);
SyntaxHighlighter.registerLanguage("shell", bash);
SyntaxHighlighter.registerLanguage("bash", bash);

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

    const safeLanguage = useMemo(() => {
        const langMap: Record<string, string> = {
            typescript: "typescript",
            javascript: "javascript",
            python: "python",
            java: "java",
            csharp: "csharp",
            go: "go",
            rust: "rust",
            swift: "swift",
            kotlin: "kotlin",
            dart: "dart",
            sql: "sql",
            html: "html",
            xml: "xml",
            css: "css",
            json: "json",
            yaml: "yaml",
            shell: "shell",
        };

        const input = language.toLowerCase();
        return langMap[input] || "typescript";
    }, [language]);

    return (
        <div className={cn(
            "relative group rounded-lg overflow-hidden border border-zinc-800 bg-[#282c34]",
            className
        )}>
            {!hideCopyButton && (
                <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-7 w-7 bg-zinc-700/50 hover:bg-zinc-600/80 text-zinc-100 backdrop-blur-md shadow-sm"
                        onClick={copyToClipboard}
                    >
                        {isCopied ? (
                            <Check className="h-3.5 w-3.5 text-green-400" />
                        ) : (
                            <Copy className="h-3.5 w-3.5" />
                        )}
                        <span className="sr-only">Copy code</span>
                    </Button>
                </div>
            )}

            <div
                className={cn(
                    "custom-scrollbar overflow-auto",
                    maxHeight ? `max-h-[${maxHeight}]` : ""
                )}
                style={maxHeight ? { maxHeight } : undefined}
            >
                <SyntaxHighlighter
                    language={safeLanguage}
                    style={oneDark}
                    customStyle={{
                        margin: 0,
                        padding: "1.5rem",
                        fontSize: "0.875rem",
                        lineHeight: "1.6",
                        background: "transparent",
                    }}
                    wrapLongLines={false}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}