import { api } from "@/lib/axios";
import { emailSchema } from "@/lib/schemas/login";
import z from "zod";

type EmailData = {
  exists: boolean;
};

export async function emailCall(formData: z.infer<typeof emailSchema>) {
  const path: string = "/auth/email";
  const data = {
    email: formData.email,
    type: "CUSTOMER",
  };
  return api.post<EmailData>(path, data);
}
