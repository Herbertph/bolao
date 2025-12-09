import { z } from "zod";

export const loginSchema = z.object({
  emailOrUsername: z.string(),
  password: z.string().min(1)
});
