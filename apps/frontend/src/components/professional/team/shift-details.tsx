import { addSchedule, Member, sendInvitation } from "@/api/organizations";

import { getOrganizationMembers } from "@/api/organizations";
import { addService, editService, Service } from "@/api/services";
import { useAuthStore } from "@/common/stores/auth.store";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { weeklyScheduleSchema } from "@/lib/schemas/members";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { DaySlots } from "./day-slots";
import { Card, CardContent } from "@/components/ui/card";
import { DatePicker } from "@/components/my-ui/date-picker";
import { useMutation } from "@tanstack/react-query";
import { ApiError } from "@/lib/axios";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member;
};

export function ShiftDetail({ open, onOpenChange, member }: Props) {
  const { mutate, isPending } = useMutation({
    mutationFn: addSchedule,
    onSuccess: (res) => {
      toast.success("Shift updated successfully!");
      onOpenChange(false);
      form.reset();
    },
    onError: (err: ApiError) => {
      toast.error(err.details.message);
    },
  });

  const form = useForm<
    z.input<typeof weeklyScheduleSchema>,
    any,
    z.output<typeof weeklyScheduleSchema>
  >({
    resolver: zodResolver(weeklyScheduleSchema),
    defaultValues: {
      validFrom: new Date(Date.now() + 24 * 60 * 60 * 1000),
      validUntil: null,
      days: {
        MONDAY: [{ startMin: 540, endMin: 1080 }],
        TUESDAY: [{ startMin: 540, endMin: 1080 }],
        WEDNESDAY: [{ startMin: 540, endMin: 1080 }],
        THURSDAY: [{ startMin: 540, endMin: 1080 }],
        FRIDAY: [{ startMin: 540, endMin: 1080 }],
        SATURDAY: [{ startMin: 600, endMin: 1020 }],
        SUNDAY: [],
      },
    },
    mode: "onChange",
  });

  const days = useWatch({
    control: form.control,
    name: "days",
  });

  const totalMinutes = Object.values(days ?? {}).reduce(
    (total, slots) =>
      total +
      slots.reduce((sum, slot) => sum + (slot.endMin - slot.startMin), 0),
    0,
  );

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        form.reset();
      }}
    >
      <SheetContent
        side="bottom"
        className="inset-0 w-screen max-w-none min-h-screen flex items-center overflow-y-auto pb-30"
        showCloseButton={false}
      >
        <nav className=" w-full  fixed shadow-xl bg-background py-2 px-8 z-50">
          <div className="flex w-full max-w- m-auto h-16 items-center justify-between">
            <h1 className="font-bold text-lg">Set {member.name} shifts</h1>
            <div className="flex gap-4">
              <SheetClose
                render={
                  <Button variant="outline" size="custom-desktop">
                    Close
                  </Button>
                }
              ></SheetClose>
              <Button type="submit" form="form-service" size="custom-desktop">
                Save
              </Button>
            </div>
          </div>
        </nav>
        <div className="flex flex-col w-full max-w-7xl p-20 mt-6">
          <SheetTitle className="text-3xl font-black my-3">
            Set {member.name} shift
          </SheetTitle>
          <SheetDescription className="text-[14px]">
            Set weekly or custom shifts. Changes saved will apply to all
            upcoming shifts for the selected period.
          </SheetDescription>
          <form
            id="form-service"
            onSubmit={form.handleSubmit((data) => {
              mutate({ ...data, memberId: member.id });
            })}
          >
            <div className="flex gap-24 mt-8 w-full">
              <Card className="w-lg h-fit">
                <CardContent>
                  <FieldGroup className="mt-1.5">
                    <Controller
                      control={form.control}
                      name="validFrom"
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel htmlFor="start-date">
                            Start date
                          </FieldLabel>
                          <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                            formatString="PPP"
                            size="custom-desktop"
                            className="text-[14px] font-medium text-left"
                            disabled={(date) => date < new Date()}
                          />

                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    ></Controller>
                    <Controller
                      control={form.control}
                      name="validUntil"
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel htmlFor="end-date">Ends</FieldLabel>
                          <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                            formatString="PPP"
                            allowNever={true}
                            size="custom-desktop"
                            className="text-[14px] font-medium text-left"
                            disabled={(date) => date < new Date()}
                          />

                          {fieldState.invalid && (
                            <FieldError
                              className="text-xs tracking-tighter"
                              errors={[fieldState.error]}
                            />
                          )}
                        </Field>
                      )}
                    ></Controller>
                  </FieldGroup>
                </CardContent>
              </Card>
              <FieldSet className="w-full">
                <FieldLegend size="large">Weekly</FieldLegend>
                <FieldDescription>
                  {hours} hours, {minutes} minutes total
                </FieldDescription>
                <FieldGroup className="mt-2 w-full">
                  <DaySlots day="MONDAY" form={form} />
                  <DaySlots day="TUESDAY" form={form} />
                  <DaySlots day="WEDNESDAY" form={form} />
                  <DaySlots day="THURSDAY" form={form} />
                  <DaySlots day="FRIDAY" form={form} />
                  <DaySlots day="SATURDAY" form={form} />
                  <DaySlots day="SUNDAY" form={form} />
                </FieldGroup>
              </FieldSet>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
