import { z } from "zod";

export const emailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Email format invalid"),
});

export const organizationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(8, "Slug must be at least 8 characters")
    .max(100, "Slug must be at most 100 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Only lowercase letters, numbers, and hyphens allowed",
    )
    .optional()
    .or(z.literal("")),
});
