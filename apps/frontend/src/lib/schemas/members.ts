import z from "zod";

const daySlotsSchema = z
  .array(
    z.object({
      startMin: z.number(),
      endMin: z.number(),
    }),
  )
  .superRefine((slots, ctx) => {
    const sorted = [...slots].sort((a, b) => a.startMin - b.startMin);

    for (let i = 0; i < sorted.length; i++) {
      const slot = sorted[i];

      if (slot.startMin >= slot.endMin) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End time must be after start time",
          path: [i, "endMin"],
        });
      }

      if (i > 0 && sorted[i - 1].endMin > slot.startMin) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Shift is overlapping",
          path: [i - 1, "endMin"],
        });

        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Shift is overlapping",
          path: [i, "startMin"],
        });
      }
    }
  });

export const weeklyScheduleSchema = z
  .object({
    validFrom: z.date(),
    validUntil: z.date().nullable().optional(),

    days: z.object({
      MONDAY: daySlotsSchema,
      TUESDAY: daySlotsSchema,
      WEDNESDAY: daySlotsSchema,
      THURSDAY: daySlotsSchema,
      FRIDAY: daySlotsSchema,
      SATURDAY: daySlotsSchema,
      SUNDAY: daySlotsSchema,
    }),
  })
  .refine((data) => !data.validUntil || data.validFrom <= data.validUntil, {
    message: "The end date must be after the start date",
    path: ["validUntil"],
  });
