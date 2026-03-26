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
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/lib/schemas/login";
import { registerAction } from "@/actions/auth/login";
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
      phone: "",
      password: "",
      confirmPassword: "",
      acceptEmails: false,
    },
    mode: "onChange",
  });

  async function onSubmit(data: z.infer<typeof registerSchema>) {
    const res = await registerAction(data);
    // handle res
  }

  return (
    <form id="form-register" onSubmit={form.handleSubmit(onSubmit)}>
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

          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="phone-id">Phone number</FieldLabel>
                <div className="flex gap-2">
                  <Select defaultValue={PHONE_PREFIXES[0].code}>
                    <SelectTrigger className="py-5 text-base w-30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {PHONE_PREFIXES.map((p) => (
                          <SelectItem
                            key={`${p.country}-${p.code}`}
                            value={p.code}
                          >
                            <span className="mr-auto"> {p.country}</span>
                            <span>{p.code} </span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Input
                    {...field}
                    id="phone-id"
                    aria-invalid={fieldState.invalid}
                    placeholder="Phone number"
                    className="py-5 text-base"
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

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
