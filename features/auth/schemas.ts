import { z } from "zod";

export const loginSchema = z.object({
    email: z.email({ message: "Please enter a valid email address" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" }),
});

export const registerSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

// Automatically infer the TypeScript type from the schema
export type LoginSchema = z.infer<typeof loginSchema>;