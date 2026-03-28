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
import { emailSchema } from "@/lib/schemas/login";
import z from "zod";
import { useAuth } from "@/common/contexts/auth-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosResponse } from "axios";

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ApiError } from "@/lib/axios";
import { emailCall } from "@/api/auth/auth";

export function EmailForm() {
  const router = useRouter();

  const { setEmail } = useAuth();

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: emailCall,
    onSuccess: (res) => {
      if (!res.data.exists) {
        setEmail(form.getValues("email"));
        router.push("customer/register");
      }
    },
    onError: (err: ApiError) => {
      if (err.statusCode === 401) {
        setEmail(form.getValues("email"));
        router.push("/auth/email-verification");
      }
      toast.error(err.details.message);
    },
  });

  return (
    <form id="form-email" onSubmit={form.handleSubmit((data) => mutate(data))}>
      <FieldSet className="w-full">
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email-id">
                  Enter your email address
                </FieldLabel>
                <Input
                  {...field}
                  id="email-id"
                  aria-invalid={fieldState.invalid}
                  placeholder="Email address"
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
