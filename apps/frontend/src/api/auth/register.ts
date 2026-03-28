import { api } from "@/lib/axios";
import { emailSchema, registerSchema } from "@/lib/schemas/login";
import z from "zod";

export async function registerCall(formData: z.infer<typeof registerSchema>) {
  const path: string = "/auth/registration/register-client";
  const data = {
    name: `${formData.lastName} ${formData.firstName}`,
    email: formData.email,
    phone: `${formData.phonePrefix}${formData.phoneNumber}`,
    password: formData.password,
  };
  return api.post<any>(path, data);
}

export async function verifyEmail(token: string) {
  const path: string = `/auth/registration/verify-email?token=${token}`;
  return api.get<any>(path);
}

export async function resendEmail({
  email,
  type,
}: {
  email: string;
  type: string;
}) {
  const path: string = "/auth/registration/resend-email";
  const data = {
    email,
    type,
  };
  return api.post<any>(path, data);
}
