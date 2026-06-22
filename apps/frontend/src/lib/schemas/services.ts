import { z } from "zod";
export const serviceSchema = z.object({
  name: z.string().min(1, "Name is required"),

  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional()
    .or(z.literal("")),

  durationMin: z.coerce
    .number()
    .int("Duration must be a whole number")
    .positive("Duration must be greater than 0")
    .min(5, "Minimum duration is 5 minutes")
    .max(24 * 60, "Maximum duration is 24 hours"),

  price: z.coerce
    .number()
    .nonnegative("Price must be 0 or greater")
    .optional()
    .nullable(),

  memberIds: z.array(z.number()).default([]),
});
