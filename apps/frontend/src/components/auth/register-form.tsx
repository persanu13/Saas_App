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
import z from "zod";
import { useAuth } from "@/common/contexts/auth-context";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/lib/schemas/login";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";
import { ApiError } from "@/lib/axios";
import { registerCall } from "@/api/auth/register";

const PHONE_PREFIXES = getCountries().map((country) => ({
  country,
  code: `+${getCountryCallingCode(country)}`,
}));

export function RegisterForm() {
  const router = useRouter();
  const { email } = useAuth();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: email ?? "",
      firstName: "",
      lastName: "",
      phonePrefix: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      acceptEmails: false,
    },
    mode: "onChange",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: registerCall,
    onSuccess: (res) => {
      router.push("email-verification");
    },
    onError: (err: ApiError) => {
      toast.error(err.details.message);
    },
  });

  return (
    <form
      id="form-register"
      onSubmit={form.handleSubmit((data) => mutate(data))}
    >
      <FieldSet className="w-full">
        <FieldGroup>
          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="firstName-id">First name</FieldLabel>
                <Input
                  {...field}
                  id="firstName-id"
                  aria-invalid={fieldState.invalid}
                  placeholder="First name"
                  className="py-5 text-base"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="lastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="lastName-id">Last name</FieldLabel>
                <Input
                  {...field}
                  id="lastName-id"
                  aria-invalid={fieldState.invalid}
                  placeholder="Last name"
                  className="py-5 text-base"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <FieldGroup className="flex flex-row">
            <Controller
              name="phonePrefix"
              control={form.control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={PHONE_PREFIXES[0].code}
                >
                  <SelectTrigger className="py-5 text-base w-30 ">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {PHONE_PREFIXES.map((p) => (
                        <SelectItem
                          key={`${p.country}-${p.code}`}
                          value={p.code}
                        >
                          <span className="mr-auto">{p.country}</span>
                          <span>{p.code}</span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />

            <Controller
              name="phoneNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    id="phone-id"
                    aria-invalid={fieldState.invalid}
                    placeholder="712 345 678"
                    className="py-5 text-base"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password-id">Password</FieldLabel>
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

          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="confirmPassword-id">
                  Confirm password
                </FieldLabel>
                <Input
                  {...field}
                  id="confirmPassword-id"
                  type="password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Confirm password"
                  className="py-5 text-base"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="acceptEmails"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="cursor-pointer"
              >
                <div className="flex items-start gap-3 w-fit ">
                  <Checkbox
                    id="acceptEmails-id"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                    className="w-6 h-6"
                  />
                  <div className="flex flex-col gap-1 cursor-pointer">
                    <FieldLabel
                      htmlFor="acceptEmails-id"
                      className="cursor-pointer"
                    >
                      I agree to receive emails about updates, offers and news
                    </FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                </div>
              </Field>
            )}
          />
        </FieldGroup>

        <Button type="submit" className="p-5 text-base">
          Create account
        </Button>
      </FieldSet>
    </form>
  );
}
