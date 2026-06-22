"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { loginSchema, UserType } from "@/lib/schemas/auth";
import z from "zod";
import { useAuth } from "@/common/contexts/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { useMutation } from "@tanstack/react-query";
import { ApiError } from "@/lib/axios";
import { loginCall } from "@/api/auth/auth";
import { useAuthStore } from "@/common/stores/auth.store";
import { useEffect } from "react";

export function LoginForm({ userType }: { userType: UserType }) {
  const router = useRouter();
  const { email } = useAuth();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: email ?? "",
      password: "",
      type: userType,
    },
    mode: "onBlur",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: loginCall,
    onSuccess: (res) => {
      useAuthStore.getState().setAuth(res.data.access_token, res.data.user);
      if (userType === "PROFESSIONAL") {
        if (redirect) {
          router.push(redirect);
        } else {
          router.push("/professional/calendar");
        }
      } else {
        router.push("/");
      }
    },
    onError: (err: ApiError) => {
      toast.error(err.details.message);
    },
  });

  useEffect(() => {
    form.setValue("email", email);
  }, [email, form]);

  return (
    <form
      id="form-password"
      onSubmit={form.handleSubmit((data) => mutate(data))}
    >
      <FieldSet className="w-full">
        <FieldGroup>
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password-id">
                  Enter your password
                </FieldLabel>
                <Input
                  {...field}
                  id="password-id"
                  type="password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Password"
                  className="py-5 text-base"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        <Button type="submit" className="p-5 text-base">
          Continue
        </Button>
      </FieldSet>
    </form>
  );
}
