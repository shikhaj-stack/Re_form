import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please provide a valid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  role: z.enum(["FACTORY", "PROCESSOR", "ADMIN"]),
  organizationName: z
    .string()
    .min(2, "Organization name must be at least 2 characters")
    .max(120),
  location: z.string().min(2, "Location is required").max(150),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
