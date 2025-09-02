import { z } from "zod";

export const registerSchema = z.object({
    email: z.email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain an uppercase letter")
        .regex(/[0-9]/, "Password must contain a number")
        .regex(/[\W_]/, "Password must contain a special character"),
    name: z.string().min(3, "Name must be at least 3 characters"),
});

export const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignupInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
