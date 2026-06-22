import { api } from "@/lib/axios";
import { emailTypeSchema, loginSchema } from "@/lib/schemas/auth";
import z from "zod";

type EmailData = {
  exists: boolean;
};

export async function emailCall(formData: z.infer<typeof emailTypeSchema>) {
  const path: string = "/auth/email";
  const data = {
    email: formData.email,
    type: formData.type,
  };
  return api.post<EmailData>(path, data);
}

export async function loginCall(formData: z.infer<typeof loginSchema>) {
  const path: string = "/auth/login";
  const data = {
    email: formData.email,
    password: formData.password,
    type: formData.type,
  };
  return api.post<any>(path, data);
}

export async function refreshCall() {
  const path: string = "/auth/refresh";
  return api.post<any>(path);
}

export async function logoutCall() {
  const path: string = "/auth/logout";
  return api.post<any>(path);
}
