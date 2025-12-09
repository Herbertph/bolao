import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(3, "First name must have at least 3 characters"),
  lastName: z.string().min(3, "Last name must have at least 3 characters"),
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, "Username must contain only letters, numbers and underscore"),
  email: z.string().email(),
  password: z
    .string()
    .min(10)
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(/[0-9]/, "Password must contain at least 1 number")
    .regex(/[!@#$%^&*()_\-+=]/, "Password must contain at least 1 symbol"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});
