"use client";

import { Service } from "@/api/services";
import { Dispatch, SetStateAction } from "react";
import { ServiceCard } from "./service-card";

type Props = {
  services: Service[];
  selectedServices: Service[];
  setSelectedServices: Dispatch<SetStateAction<Service[]>>;
};

export function SelectService({
  services,
  selectedServices,
  setSelectedServices,
}: Props) {
  const toggleService = (service: Service) => {
    setSelectedServices((prev) => {
      const exists = prev.some((s) => s.id === service.id);

      if (exists) {
        return prev.filter((s) => s.id !== service.id);
      }

      return [...prev, service];
    });
  };

  return (
    <div className="w-full">
      <h1 className="text-4xl font-black mb-8">Select services</h1>
      {services.length > 0 ? (
        <div className="grid grid-cols-1  gap-4 ">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              variant="full"
              isSelected={selectedServices.some((s) => s.id === service.id)}
              onClick={toggleService}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground mt-4">No services available yet.</p>
      )}
    </div>
  );
}
