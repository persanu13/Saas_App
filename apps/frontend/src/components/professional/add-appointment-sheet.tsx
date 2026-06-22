"use client";
import { cn, formatDurationMin } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AddCircleIcon,
  ArrowDown01Icon,
  Cancel01Icon,
  Cancel02Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";
import { SearchBar } from "../my-ui/search-bar";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Client, getOrganizationServices } from "@/api/organizations";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMemberServices, Service } from "@/api/services";
import { useSearchParams } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { SelectServiceSheet } from "./select-service-sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { SelectClientSheet } from "./select-client-sheet";
import { bookApoinment, createApoinment } from "@/api/appoinments";
import { toast } from "sonner";
import { ApiError } from "@/lib/axios";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSlot: number | null;
};

export function AddApoinmentSheet({
  isOpen,
  onOpenChange,
  selectedSlot,
}: Props) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectServiceOpen, setSelectServiceOpen] = useState<boolean>(false);
  const [selectClientOpen, setSelectClientOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const memberId = Number(searchParams.get("member_id"));

  const { mutate, isPending } = useMutation({
    mutationFn: bookApoinment,
    onSuccess: (res) => {
      toast.success("Appoinment was created with succes!");
      queryClient.invalidateQueries({
        queryKey: ["calendar"],
      });
      handleExit();
    },
    onError: (err: ApiError) => {
      toast.error(
        "Member is not available at the selected time. Please select others time",
      );
    },
  });

  const total = selectedServices.reduce(
    (sum, service) => sum + (service.price ?? 0),
    0,
  );

  const formattedTotal = new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
  }).format(total);

  const handleExit = () => {
    onOpenChange(false);
    setSelectServiceOpen(false);
    setSelectClientOpen(false);
    setSelectedClient(null);
    setSelectedServices([]);
  };

  return (
    <div
      className={cn(
        "fixed right-0 top-0 h-full w-fit z-50 transition-transform duration-200 flex",
        isOpen ? "translate-x-0" : "translate-x-full",
      )}
    >
      <SelectServiceSheet
        isOpen={selectServiceOpen}
        onOpenChange={setSelectServiceOpen}
        setSelectedServices={setSelectedServices}
      ></SelectServiceSheet>
      <SelectClientSheet
        isOpen={selectClientOpen}
        onOpenChange={setSelectClientOpen}
        setSelectedClient={setSelectedClient}
      ></SelectClientSheet>

      <div className="p-4 bg-transparent">
        <Button
          className="rounded-full size-12"
          variant="outline"
          onClick={handleExit}
        >
          <HugeiconsIcon
            strokeWidth={2}
            className="size-6"
            icon={Cancel01Icon}
          />
        </Button>
      </div>

      <div className="bg-background border-l shadow-xl w-120  flex flex-col pb-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-base font-medium">New appointment</h1>
        </div>

        <div className="flex flex-col px-6  mt-6">
          <div>
            <h1 className="text-lg font-bold text-foreground">
              Select a Client
            </h1>
            <p className="text-muted-foreground text-base font-medium">
              Or leave empty for walk-ins
            </p>
            {selectedClient ? (
              <Button
                className="mt-4 gap-2 "
                variant="outline"
                size="lg"
                onClick={() => {
                  setSelectClientOpen(true);
                }}
              >
                <span>{selectedClient.user.name}</span>
                <HugeiconsIcon
                  strokeWidth={2}
                  className="size-4"
                  icon={ArrowDown01Icon}
                />
              </Button>
            ) : (
              <Button
                className="mt-4 gap-2 "
                variant="outline"
                size="lg"
                onClick={() => {
                  setSelectClientOpen(true);
                }}
              >
                <span>Select Client</span>
                <HugeiconsIcon
                  strokeWidth={2}
                  className="size-4"
                  icon={ArrowDown01Icon}
                />
              </Button>
            )}
          </div>
        </div>

        <Separator className="my-6"></Separator>

        <div className="flex flex-col px-6 flex-1 min-h-0 ">
          <h1 className="text-lg font-bold text-foreground ml-2">Services</h1>
          <ScrollArea className="flex-1 min-h-0 pr-2">
            <div className="flex flex-col gap-1  ">
              {selectedServices.map((service, index) => {
                return (
                  <div
                    className=" p-2 h-fit hover:bg-muted hover:text-foreground gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 cursor-pointer  group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0  [&_svg:not([class*='size-'])]:size-4"
                    key={index}
                  >
                    <div className="h-20 w-1 bg-primary/50 rounded-2xl"></div>
                    <div className="flex py-2 px-2 bg-red w-full justify-between ">
                      <div className="flex flex-col items-start">
                        <p className="text-base">{service.name}</p>
                        <p className="text-muted-foreground">
                          {formatDurationMin(service.durationMin)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-base">Ron {service.price}</p>
                        <Tooltip>
                          <TooltipTrigger
                            delay={0}
                            render={
                              <Button
                                variant="ghost"
                                onClick={() => {
                                  setSelectedServices((prev) =>
                                    prev.filter((_, i) => i !== index),
                                  );
                                }}
                              />
                            }
                          >
                            <HugeiconsIcon
                              className="[svg]:size-5"
                              icon={Delete02Icon}
                            />
                          </TooltipTrigger>
                          <TooltipContent>Remove</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button
              className="mt-4 gap-2 "
              variant="outline"
              size="lg"
              onClick={() => {
                setSelectServiceOpen(true);
              }}
            >
              <span>Add Service</span>
              <HugeiconsIcon
                strokeWidth={2}
                className="size-4"
                icon={AddCircleIcon}
              />
            </Button>
          </ScrollArea>
        </div>
        <Separator className="my-6"></Separator>
        <div className="flex flex-col px-6  mb-2">
          <div className="flex justify-between font-medium">
            <p>Total</p>
            <p>{formattedTotal}</p>
          </div>
          <div className="flex gap-6 mt-4">
            <Button
              variant="outline"
              size="custom-desktop"
              className="flex-1"
              onClick={handleExit}
            >
              Close
            </Button>
            <Button
              className="flex-1"
              size="custom-desktop"
              disabled={selectedServices.length <= 0}
              onClick={() => {
                if (memberId && date && selectedSlot) {
                  const updatedServices = selectedServices.map((s) => ({
                    ...s,
                    selectedProfessionalId: memberId,
                  }));
                  mutate({
                    dateTime: {
                      date,
                      startMin: selectedSlot * 15,
                    },
                    selectedServices,
                    clientId: selectedClient?.user.id,
                  });
                }
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
