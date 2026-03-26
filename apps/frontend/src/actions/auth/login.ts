"use server";
import { api } from "@/lib/axios";
import { emailSchema } from "@/lib/schemas/login";
import axios from "axios";
import z from "zod";

export async function emailAction(formData: z.infer<typeof emailSchema>) {
  const email = formData.email;

  try {
    const data = await api.post("/auth/email", { email, type: "" });
    console.log(data);
  } catch (error: any) {
    console.log(error.response.data);
  }
}
