"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/axios";
import { registerSchema } from "@/lib/schemas/auth";
import { serviceSchema } from "@/lib/schemas/services";
import { formatDurationMin } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDuration } from "date-fns";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { fa } from "zod/v4/locales";

const DURATIONS = [
  15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 210, 240, 270, 300,
];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: Service | null;
};

type ServiceMutation =
  | {
      mode: "create";
      data: z.output<typeof serviceSchema>;
    }
  | {
      mode: "edit";
      id: number;
      data: z.output<typeof serviceSchema>;
    };

export function ServiceDetail({ open, onOpenChange, service }: Props) {
  const { user } = useAuthStore();
  const { data, isLoading, error } = useQuery({
    queryKey: ["organization_members"],
    queryFn: getOrganizationMembers,
  });
  const members = data?.data ?? [];
  const meMember = members.find((m: any) => m.userId == user?.sub);

  const form = useForm<
    z.input<typeof serviceSchema>,
    any,
    z.output<typeof serviceSchema>
  >({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "0.00",
      durationMin: 60,
      memberIds: [meMember?.id],
    },
    mode: "onBlur",
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: ServiceMutation) => {
      if (payload.mode === "edit") {
        return editService(payload.id, payload.data);
      }

      return addService(payload.data);
    },
    onSuccess: (res) => {
      const message = service
        ? "Service edited succesful!"
        : "Service added succesful!";
      toast.success(message);
      queryClient.invalidateQueries({
        queryKey: ["organization_services"],
      });
      onOpenChange(false);
      form.reset();
    },
    onError: (err: ApiError) => {
      toast.error(err.details.message);
    },
  });

  useEffect(() => {
    if (!open) return;

    const baseMemberIds = meMember?.id ? [meMember.id] : [];

    if (service) {
      form.reset({
        name: service.name,
        description: service.description ?? "",
        price: service.price.toFixed(2),
        durationMin: service.durationMin,
        memberIds: service ? service.members.map((m) => m.id) : baseMemberIds,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        price: "0.00",
        durationMin: 60,
        memberIds: baseMemberIds,
      });
    }
  }, [open, service, meMember?.id]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="inset-0 w-screen max-w-none min-h-screen flex items-center overflow-y-auto pb-30"
        showCloseButton={false}
      >
        <nav className=" w-full  fixed shadow-xl bg-background py-2 px-8 z-50">
          <div className="flex w-full max-w-7xl m-auto h-16 items-center justify-between">
            <h1 className="font-bold text-lg">
              {!service ? "New Serivice" : "Edit service"}
            </h1>
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
          <h1 className="text-3xl font-black">
            {!service ? "New Serivice" : "Edit service"}
          </h1>
          <form
            id="form-service"
            onSubmit={form.handleSubmit((data) => {
              mutate(
                service
                  ? {
                      mode: "edit",
                      id: service.id,
                      data,
                    }
                  : {
                      mode: "create",
                      data,
                    },
              );
            })}
          >
            <FieldGroup className="mt-12 gap-12">
              <FieldSet>
                <FieldLegend size="large">Basic Details</FieldLegend>
                <FieldGroup>
                  <Controller
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor="service-name">
                          Service name
                        </FieldLabel>
                        <Input
                          {...field}
                          id="service-name"
                          placeholder="Add a service name, e.g. Men's Haircut"
                          i_size="large"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  ></Controller>
                  <Controller
                    control={form.control}
                    name="description"
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor="description">
                          Description{" "}
                          <span className="text-muted-foreground font-normal">
                            (Optional)
                          </span>
                        </FieldLabel>
                        <Textarea
                          {...field}
                          id="description"
                          placeholder="Add a short description"
                          className="resize-none"
                          i_size="large"
                          aria-invalid={fieldState.invalid}
                        />
                      </Field>
                    )}
                  ></Controller>
                </FieldGroup>
              </FieldSet>

              <FieldSet>
                <FieldLegend size="large">Pricing and duration</FieldLegend>
                <FieldGroup className="flex flex-row">
                  <Controller
                    control={form.control}
                    name="price"
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor="price">Price</FieldLabel>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                            RON
                          </span>
                          <Input
                            {...field}
                            value={field.value as string | number | undefined}
                            i_size="large"
                            type="number"
                            id="price-id"
                            aria-invalid={fieldState.invalid}
                            placeholder="0.00"
                            min={0}
                            className="pl-14"
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              field.onChange(e.target.value);
                              if (
                                value &&
                                value !== Math.round(value * 100) / 100
                              ) {
                                e.target.value = value.toFixed(2);
                              }
                            }}
                            onBlur={(e) => {
                              const value = Number(e.target.value);
                              e.target.value = Math.max(value, 0).toFixed(2);
                              field.onChange(e.target.value);
                            }}
                          />
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="durationMin"
                    control={form.control}
                    render={({ field }) => (
                      <Field>
                        <FieldLabel htmlFor="service-name">Duration</FieldLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={30}
                        >
                          <SelectTrigger variant="my">
                            <SelectValue>
                              {formatDurationMin(Number(field.value))}
                            </SelectValue>
                          </SelectTrigger>

                          <SelectContent
                            side="top"
                            alignItemWithTrigger={false}
                          >
                            {DURATIONS.map((val) => {
                              return (
                                <SelectItem key={val} value={val}>
                                  {formatDurationMin(val)}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  />
                </FieldGroup>
              </FieldSet>

              <FieldSet>
                <FieldLegend size="large">Team members required</FieldLegend>
                <FieldDescription>
                  Choose which team members will perform this service
                </FieldDescription>
                <FieldGroup className="flex flex-row">
                  <Controller
                    name="memberIds"
                    control={form.control}
                    render={({ field, fieldState }) => {
                      const selectAll =
                        members.length > 0 &&
                        members.every((m) => field.value?.includes(m.id));

                      const handleSelectAll = (checked: boolean) => {
                        if (checked) {
                          field.onChange(members.map((m) => m.id));
                        } else {
                          field.onChange([]);
                        }
                      };

                      return (
                        <Field data-invalid={fieldState.invalid}>
                          <div className="space-y-6">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                size="large"
                                id={`member-all`}
                                checked={selectAll}
                                onCheckedChange={handleSelectAll}
                              />
                              <FieldLabel
                                size="large"
                                htmlFor={`member-all`}
                                className="text-sm cursor-pointer"
                              >
                                All team members
                              </FieldLabel>
                            </div>
                            {members.map((member) => (
                              <div
                                key={member.id}
                                className="flex items-center gap-2"
                              >
                                <Checkbox
                                  size="large"
                                  id={`member-${member.id}`}
                                  checked={field.value?.includes(member.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([
                                        ...(field.value ?? []),
                                        member.id,
                                      ]);
                                    } else {
                                      field.onChange(
                                        field.value?.filter(
                                          (id: number) => id !== member.id,
                                        ),
                                      );
                                    }
                                  }}
                                />

                                <FieldLabel
                                  size="large"
                                  htmlFor={`member-${member.id}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {member.name}
                                </FieldLabel>
                              </div>
                            ))}
                          </div>
                        </Field>
                      );
                    }}
                  />
                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
