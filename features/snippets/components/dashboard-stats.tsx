"use client";

import { useMemo } from "react";
import { Snippet, SnippetVisibility } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Globe, Lock, Terminal } from "lucide-react";

interface DashboardStatsProps {
    snippets: Snippet[];
}

export function DashboardStats({ snippets }: DashboardStatsProps) {
    // Memoize expensive calculations
    const stats = useMemo(() => {
        const total = snippets.length;
        const publicCount = snippets.filter(s => s.visibility === SnippetVisibility.PUBLIC).length;
        const privateCount = snippets.filter(s => s.visibility === SnippetVisibility.PRIVATE).length;

        // Calculate most used language safely
        const langCounts = snippets.reduce((acc: Record<string, number>, s) => {
            acc[s.language] = (acc[s.language] || 0) + 1;
            return acc;
        }, {});

        const topLanguage = Object.entries(langCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

        return [
            {
                title: "Total Snippets",
                value: total,
                icon: Code2,
                desc: "Saved in vault",
                color: "text-blue-500",
                bg: "bg-blue-500/10",
            },
            {
                title: "Public",
                value: publicCount,
                icon: Globe,
                desc: "Community visible",
                color: "text-green-500",
                bg: "bg-green-500/10",
            },
            {
                title: "Private",
                value: privateCount,
                icon: Lock,
                desc: "Secure & hidden",
                color: "text-amber-500",
                bg: "bg-amber-500/10",
            },
            {
                title: "Top Language",
                value: topLanguage,
                icon: Terminal,
                desc: "Most frequent",
                color: "text-purple-500",
                bg: "bg-purple-500/10",
            },
        ];
    }, [snippets]);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.title} className="shadow-sm border-zinc-200 dark:border-zinc-800 transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                        </CardTitle>
                        <div className={`p-2 rounded-full ${stat.bg}`}>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold capitalize tracking-tight">{stat.value}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {stat.desc}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}