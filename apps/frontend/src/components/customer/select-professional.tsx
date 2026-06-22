"use client";

import { Service } from "@/api/services";
import { Dispatch, SetStateAction } from "react";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { formatDurationMin } from "@/lib/utils";
import { Button } from "../ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  selectedServices: Service[];
  setSelectedServices: Dispatch<SetStateAction<Service[]>>;
};

export function SelectProfessional({
  selectedServices,
  setSelectedServices,
}: Props) {
  const selectProfessional = (
    serviceId: number,
    professionalId: number | null,
  ) => {
    setSelectedServices((prev) =>
      prev.map((service) =>
        service.id === serviceId
          ? {
              ...service,
              selectedProfessionalId: professionalId,
            }
          : service,
      ),
    );
  };
  return (
    <div className="w-full">
      <h1 className="text-4xl font-black mb-8">Select professional</h1>

      <div className="grid grid-cols-1  gap-4 ">
        {selectedServices.map((service) => {
          const selectedMember =
            service.members?.find(
              (m) => m.id === service.selectedProfessionalId,
            ) ?? null;

          return (
            <Card key={service.id}>
              <CardContent>
                <CardTitle>{service.name}</CardTitle>

                <CardDescription>
                  {formatDurationMin(service.durationMin)}
                </CardDescription>

                <Select
                  value={service.selectedProfessionalId?.toString() ?? "none"}
                  onValueChange={(value) =>
                    selectProfessional(
                      service.id,
                      value === "none" ? null : Number(value),
                    )
                  }
                >
                  <SelectTrigger className="mt-4 w-50">
                    <SelectValue>
                      {selectedMember ? selectedMember.name : "No preferance"}
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent alignItemWithTrigger={false}>
                    <SelectItem value="none">No preference</SelectItem>

                    {service.members?.map((member) => (
                      <SelectItem key={member.id} value={member.id.toString()}>
                        {member.name ?? `Member ${member.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
