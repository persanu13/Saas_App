"use client";

import { createOrganization } from "@/api/organizations";
import { StepProgress } from "@/components/my-ui/step-progress";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/axios";
import { organizationSchema } from "@/lib/schemas/organizations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function SettupPage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof organizationSchema>>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
    mode: "onBlur",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createOrganization,
    onSuccess: (res) => {
      router.push("/professional/calendar");
      toast.success(`Your business ${res.data.name} was created succesful!`);
    },
    onError: (err: ApiError) => {
      console.log(err);
      toast.error(err.details.message);
    },
  });

  return (
    <div className="px-5 py-4 flex flex-col items-center">
      <div className="max-w-lg mt-12">
        <p className="text-lg md:text-base text-muted-foreground">
          Account setup
        </p>
        <form
          id="form-create-organization"
          onSubmit={form.handleSubmit((data) => mutate(data))}
        >
          <FieldSet>
            <FieldLegend className="data-[variant=label]:text-3xl data-[variant=legend]:text-3xl py-3 font-black">
              What's your business name?
            </FieldLegend>
            <FieldDescription className="text-lg md:text-base">
              This is the brand name your clients will see. Don't worry, it can
              be changed later.
            </FieldDescription>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="businessName"
                      className="text-lg md:text-base"
                    >
                      Business name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="businessName"
                      aria-invalid={fieldState.invalid}
                      className="text-lg md:text-base py-5"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="slug"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="slug" className="text-lg md:text-base">
                      Slug{" "}
                      <span className="text-muted-foreground font-normal ">
                        (Optional)
                      </span>
                    </FieldLabel>

                    <Input
                      {...field}
                      id="slug"
                      aria-invalid={fieldState.invalid}
                      className="text-lg md:text-base py-5"
                    />
                    <FieldDescription className="text-lg md:text-base">
                      This will be your booking page URL:{" "}
                      <span className="font-medium">trimly.com/your-slug</span>.
                      Only letters, numbers, and hyphens allowed.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Field orientation="horizontal">
                <Button
                  type="submit"
                  size="lg"
                  className="text-[16px] font-medium py-5 px-5"
                >
                  Save
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  type="button"
                  className="text-[16px] py-5 px-5"
                  onClick={() => {
                    router.push("/professional/account-type");
                  }}
                >
                  Cancel
                </Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      </div>
    </div>
  );
}
