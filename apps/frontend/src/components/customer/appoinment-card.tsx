"use client";

import { getOrganizationMembers, Organization } from "@/api/organizations";
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
  SheetTitle,
} from "@/components/ui/sheet";

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { DayAndTime, Step } from "./make-appoinment";
import { Separator } from "../ui/separator";
import { formatDurationMin } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { useMutation } from "@tanstack/react-query";
import { bookApoinment } from "@/api/appoinments";
import { toast } from "sonner";
import { ApiError } from "@/lib/axios";

type Props = {
  organizationName: string;
  selectedServices: Service[];
  selectedTime: DayAndTime | null;
  step: Step;
  setStep: Dispatch<SetStateAction<Step>>;
  handleExit: () => void;
};

export function ApoinmentCard({
  organizationName,
  selectedServices,
  selectedTime,
  step,
  setStep,
  handleExit,
}: Props) {
  const steps: { key: Step; label: string }[] = [
    { key: "services", label: "Services" },
    { key: "professional", label: "Professional" },
    { key: "time", label: "Time" },
    { key: "confirm", label: "Confirm" },
  ];
  const { user } = useAuthStore();

  const { mutate, isPending } = useMutation({
    mutationFn: bookApoinment,
    onSuccess: (res) => {
      toast.success("Appoinment was created with succes!");
      handleExit();
    },
    onError: (err: ApiError) => {
      toast.error(err.details.message);
    },
  });

  const handleNext = () => {
    const currentIndex = steps.findIndex((s) => s.key === step);

    if (step === "confirm" && selectedTime) {
      mutate({
        clientId: user?.sub,
        selectedServices,
        dateTime: selectedTime,
      });
      return;
    }

    if (currentIndex === -1) return;

    const nextStep = steps[currentIndex + 1];

    if (nextStep) {
      setStep(nextStep.key);
    }
  };

  const disabled = () => {
    if (step === "services") {
      return selectedServices.length < 1;
    }
    if (step === "time") {
      return !selectedTime;
    }
    return false;
  };

  const total = selectedServices.reduce(
    (sum, service) => sum + (service.price ?? 0),
    0,
  );

  const formattedTotal = new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
  }).format(total);

  return (
    <Card className="mx-auto w-full max-w-sm px-4 py-8   max-h-140 h-140 sticky top-40">
      <CardHeader>
        <CardTitle className="text-xl font-black ">
          Make Appoinment to {organizationName}
        </CardTitle>
      </CardHeader>

      <CardContent className=" mb-auto ">
        <Separator className="mt-2 mb-4"></Separator>
        <div className="flex flex-col gap-4 max-h-75 overflow-y-auto">
          {selectedServices.length > 0 ? (
            selectedServices.map((service) => {
              return (
                <div key={service.id} className="flex justify-between">
                  <div className="flex flex-col">
                    <h1 className="font-medium text-sm">{service.name}</h1>
                    <p className="text-muted-foreground text-xs  font-medium">
                      {formatDurationMin(service.durationMin)}
                    </p>
                  </div>
                  <p className="font-medium ">RON {service.price}</p>
                </div>
              );
            })
          ) : (
            <p className="text-muted-foreground">No services selected</p>
          )}
        </div>
        <Separator className="my-4 "></Separator>
        <div className="flex justify-between">
          <p className="font-bold text-base">Total</p>
          <p className="font-bold text-base">{formattedTotal}</p>
        </div>
      </CardContent>
      <CardAction className="w-full px-6">
        <Button
          size="custom-desktop"
          className="w-full"
          onClick={handleNext}
          disabled={disabled()}
        >
          {step === "confirm" ? "Confirm" : "Continue"}
        </Button>
      </CardAction>
    </Card>
  );
}
