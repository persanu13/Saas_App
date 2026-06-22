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
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { ApoinmentCard } from "./appoinment-card";
import { SelectService } from "./select-service";
import { SelectProfessional } from "./select-professional";
import { SelectDate } from "./select-date";
import { Confirm } from "./confirm";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon, Cancel01Icon } from "@hugeicons/core-free-icons";

export type Step = "services" | "professional" | "time" | "confirm";

export type DayAndTime = {
  date: string;
  startMin: number;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization: Organization;
  service?: Service | null;
  selectedServices: Service[];
  setSelectedServices: Dispatch<SetStateAction<Service[]>>;
};

export function MakeApoinment({
  open,
  onOpenChange,
  organization,
  selectedServices,
  setSelectedServices,
}: Props) {
  const [step, setStep] = useState<Step>("services");
  const [selectedTime, setSelectedTime] = useState<DayAndTime | null>(null);
  const [comment, setComment] = useState<string>("");

  const steps: { key: Step; label: string }[] = [
    { key: "services", label: "Services" },
    { key: "professional", label: "Professional" },
    { key: "time", label: "Time" },
    { key: "confirm", label: "Confirm" },
  ];

  const pages = {
    services: (
      <SelectService
        services={organization.services}
        selectedServices={selectedServices}
        setSelectedServices={setSelectedServices}
      />
    ),
    professional: (
      <SelectProfessional
        selectedServices={selectedServices}
        setSelectedServices={setSelectedServices}
      />
    ),
    time: (
      <SelectDate
        selectedServices={selectedServices}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
      />
    ),
    confirm: <Confirm comment={comment} setComment={setComment} />,
  };

  const handleExit = () => {
    onOpenChange(false);
    setStep("services");
    setSelectedTime(null);
    setSelectedServices([]);
    return;
  };

  const handleBack = () => {
    const currentIndex = steps.findIndex((s) => s.key === step);

    if (currentIndex <= 0) {
      handleExit();
    }

    const prevStep = steps[currentIndex - 1];

    if (prevStep) {
      setStep(prevStep.key);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="inset-0 w-screen max-w-none min-h-screen flex items-center overflow-y-auto pb-30 "
        showCloseButton={false}
      >
        <nav className="h-16 flex w-full max-w-360 items-center fixed justify-between px-6">
          <Button
            variant="outline"
            className="rounded-full size-12"
            onClick={() => {
              handleBack();
            }}
          >
            <HugeiconsIcon className="size-7" icon={ArrowLeft02Icon} />
          </Button>
          <Button
            variant="outline"
            className="rounded-full size-12"
            onClick={handleExit}
          >
            <HugeiconsIcon className="size-7" icon={Cancel01Icon} />
          </Button>
        </nav>
        <main className="flex flex-col w-full  max-w-6xl mt-20">
          <Breadcrumb>
            <BreadcrumbList>
              {steps.map((s, index) => {
                const currentIndex = steps.findIndex((st) => st.key === step);
                const isActive = step === s.key;
                const canNavigate = index < currentIndex; // doar înapoi

                return (
                  <Fragment key={s.key}>
                    <BreadcrumbItem>
                      {isActive ? (
                        <BreadcrumbPage>{s.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          onClick={() => {
                            if (canNavigate) setStep(s.key);
                          }}
                          className={
                            canNavigate
                              ? "cursor-pointer"
                              : "pointer-events-none opacity-50"
                          }
                        >
                          {s.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>

                    {index !== steps.length - 1 && <BreadcrumbSeparator />}
                  </Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex relative w-full gap-20">
            <div className="flex-1 mt-6 min-w-0">
              {pages[step] ?? <p>Something went wrong</p>}
            </div>
            <ApoinmentCard
              organizationName={organization.name}
              selectedServices={selectedServices}
              selectedTime={selectedTime}
              step={step}
              setStep={setStep}
              handleExit={handleExit}
            ></ApoinmentCard>
          </div>
        </main>
      </SheetContent>
    </Sheet>
  );
}
