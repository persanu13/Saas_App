"use server";
import { api, ApiResponse } from "@/lib/axios";
import { emailSchema, registerSchema } from "@/lib/schemas/login";
import z from "zod";

type EmailData = {
  exists: boolean;
};

export async function emailAction(formData: z.infer<typeof emailSchema>) {
  return (await api.post("/auth/email", {
    email: formData.email,
    type: "CUSTOMER",
  })) as ApiResponse<EmailData>;
}

export async function registerAction(
  formData: z.infer<typeof registerSchema>,
) {}
