"use client";

import {
  Field,
  FieldDescription,
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
import { toast } from "sonner";
import { emailAction } from "@/actions/auth/login";

export function EmailForm() {
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
  });

  async function onSubmit(data: z.infer<typeof emailSchema>) {
    const result = await emailAction(data);
  }

  return (
    <form id="form-email" onSubmit={form.handleSubmit(onSubmit)}>
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
