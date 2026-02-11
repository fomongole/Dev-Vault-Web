import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { LoginSchema } from "../schemas";
import { toast } from "sonner";

interface LoginResponse {
    access_token: string;
}

export const useLogin = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: async (data: LoginSchema) => {
            const response = await api.post<LoginResponse>("/auth/login", data);
            return response.data;
        },
        onSuccess: (data) => {
            localStorage.setItem("token", data.access_token);
            toast.success("Welcome back!");
            router.push("/dashboard");
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Something went wrong";
            // toast.error(message);
            console.error("Login failed:", error);
        },
    });
};