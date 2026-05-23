"use client";

import { StepProgress } from "@/components/my-ui/step-progress";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function SettupPage() {
  const router = useRouter();
  return (
    <div className="px-5 py-4 flex flex-col items-center">
      <div className="max-w-lg mt-12">
        <p className="text-lg md:text-base text-muted-foreground">
          Account setup
        </p>
        <FieldSet>
          <FieldLegend className="data-[variant=label]:text-3xl data-[variant=legend]:text-3xl py-3 font-black">
            What's your business name?
          </FieldLegend>
          <FieldDescription className="text-lg md:text-base">
            This is the brand name your clients will see. Don't worry, it can be
            changed later.
          </FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel
                htmlFor="businessName"
                className="text-lg md:text-base"
              >
                Business name
              </FieldLabel>
              <Input
                id="businessName"
                className="text-lg md:text-base py-6"
              ></Input>
            </Field>
            <Field orientation="horizontal">
              <Button
                type="submit"
                size="lg"
                className="text-[16px] font-medium py-6 px-6"
                onClick={() => {
                  router.push("/");
                }}
              >
                Save
              </Button>
              <Button
                size="lg"
                variant="outline"
                type="button"
                className="text-[16px] py-6 px-6"
              >
                Cancel
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </div>
    </div>
  );
}
