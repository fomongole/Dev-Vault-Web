"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function GuestGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [status, setStatus] = useState<"checking" | "is-guest">("checking");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            router.replace("/dashboard");
        } else {
            setStatus("is-guest");
        }
    }, [router]);

    if (status === "checking") {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return <>{children}</>;
}