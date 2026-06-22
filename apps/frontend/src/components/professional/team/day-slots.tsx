import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { weeklyScheduleSchema } from "@/lib/schemas/members";
import { formatDurationMin, formatMinutes } from "@/lib/utils";
import { AddCircleIcon, Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import z from "zod";

type DayProps = {
  day:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";
  form: UseFormReturn<
    z.input<typeof weeklyScheduleSchema>,
    any,
    z.output<typeof weeklyScheduleSchema>
  >;
};

export function DaySlots({ day, form }: DayProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `days.${day}`,
  });

  const handleCheck = (value: boolean) => {
    if (value) {
      append({
        startMin: 540,
        endMin: 1080,
      });
    } else {
      remove();
    }
  };

  return (
    <div className="flex items-start w-full">
      <Field orientation="horizontal" className="w-fit">
        <Checkbox
          size="large"
          id={`day-${day}`}
          checked={!!fields.length}
          onCheckedChange={handleCheck}
        />
        <FieldLabel
          htmlFor={`day-${day}`}
          className="font-medium  w-36 ml-1"
          defaultChecked
        >
          {day}
        </FieldLabel>
      </Field>

      <div className="flex flex-col flex-1 py-1 gap-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-3 w-full">
            <Controller
              control={form.control}
              name={`days.${day}.${index}.startMin`}
              render={({ field, fieldState }) => (
                <Field className="w-full max-w-xl">
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger variant="my" className="w-full">
                      <SelectValue>
                        {formatMinutes(Number(field.value))}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent
                      alignItemWithTrigger={false}
                      className="h-100"
                    >
                      <SelectGroup>
                        {Array.from({ length: 288 }, (_, i) => i * 5).map(
                          (minute) => (
                            <SelectItem key={minute} value={minute}>
                              {formatMinutes(minute)}
                            </SelectItem>
                          ),
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  {fieldState.invalid && (
                    <FieldError
                      className="text-xs tracking-tighter"
                      errors={[fieldState.error]}
                    />
                  )}
                </Field>
              )}
            />

            <span className="text-muted-foreground">to</span>

            <Controller
              control={form.control}
              name={`days.${day}.${index}.endMin`}
              render={({ field, fieldState }) => (
                <Field className="w-full max-w-xl">
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger variant="my" className="w-full">
                      <SelectValue>
                        {formatMinutes(Number(field.value))}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent
                      alignItemWithTrigger={false}
                      className="h-100"
                    >
                      <SelectGroup>
                        {Array.from({ length: 288 }, (_, i) => i * 5).map(
                          (minute) => (
                            <SelectItem key={minute} value={minute}>
                              {formatMinutes(minute)}
                            </SelectItem>
                          ),
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  {fieldState.invalid && (
                    <FieldError
                      className="text-xs tracking-tighter"
                      errors={[fieldState.error]}
                    />
                  )}
                </Field>
              )}
            />
            <div className="flex">
              <Button
                type="button"
                variant="ghost"
                className="rounded-full"
                disabled={index + 1 < fields.length}
                onClick={() =>
                  append({
                    startMin: Math.min(field.endMin + 60, 1380),
                    endMin: Math.min(field.endMin + 120, 1435),
                  })
                }
              >
                <HugeiconsIcon
                  strokeWidth={2}
                  icon={AddCircleIcon}
                  className="size-4.5"
                />
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="rounded-full text-destructive hover:text-destructive"
                onClick={() => remove(index)}
              >
                <HugeiconsIcon
                  strokeWidth={2}
                  icon={Delete02Icon}
                  className="size-4.5"
                />
              </Button>
            </div>
          </div>
        ))}
        {!fields.length && (
          <p className="text-nowrap text-muted-foreground">Not working</p>
        )}
      </div>
    </div>
  );
}
