import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

export const emailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Email format invalid"),
});

export const registerSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Email format invalid"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),

    phonePrefix: z.string().min(1),
    phoneNumber: z.string().min(1, "Phone is required"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),

    confirmPassword: z.string().min(1, "Confirm password is required"),
    acceptEmails: z.boolean().refine((val) => val === true, {
      message: "You must accept to receive emails",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => isValidPhoneNumber(`${data.phonePrefix}${data.phoneNumber}`),
    {
      message: "Phone format invalid",
      path: ["phoneNumber"], // eroarea apare pe input-ul de număr
    },
  );
