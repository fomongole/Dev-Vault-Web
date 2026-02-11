import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { RegisterSchema } from "../schemas";
import { toast } from "sonner";

export const useRegister = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: async (data: RegisterSchema) => {
            await api.post("/auth/register", data);
        },
        onSuccess: () => {
            toast.success("Account created! Please log in.");
            router.push("/login");
        },
        onError: (error: any) => {
            // toast.error(error.response?.data?.message || "Registration failed");
        },
    });
};