import { getCalendar } from "@/api/calendar";
import { Button } from "../ui/button";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { cn, formatDurationMin } from "@/lib/utils";
import { useState } from "react";
import { AddApoinmentSheet } from "./add-appointment-sheet";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { deleteApoinment } from "@/api/appoinments";
import { toast } from "sonner";
import { ApiError } from "@/lib/axios";

export function Schedule() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const hours = Array.from(
    { length: 24 },
    (_, i) => String(i).padStart(2, "0") + ":00",
  );

  const slots = Array.from({ length: 24 * 4 }, (_, i) => {
    const totalMin = i * 15;
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  });

  const { mutate, isPending } = useMutation({
    mutationFn: deleteApoinment,
    onSuccess: (res) => {
      toast.success("Appoinment deleted succesful!");
      queryClient.invalidateQueries({
        queryKey: ["calendar"],
      });
    },
    onError: (err: ApiError) => {
      toast.error(err.details.message);
    },
  });

  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const view = searchParams.get("view");
  const memberId = searchParams.get("member_id");

  const { data, isLoading, error } = useQuery({
    queryKey: ["calendar", date, view, memberId],
    queryFn: () => getCalendar({ date, view, memberId }),
    enabled: !!date && !!view && !!memberId,
  });

  if (isLoading) return <p>Is Loading...</p>;

  const workSlots = data?.data.slots ?? [];
  const appoinments = data?.data.appoinments ?? [];

  const isInWorkSlots = (min: number) => {
    return workSlots.some((slot) => min >= slot.startMin && min < slot.endMin);
  };

  return (
    <div className="flex-1 overflow-y-auto min-h-0  ">
      <AddApoinmentSheet
        isOpen={isOpen}
        selectedSlot={selectedSlot}
        onOpenChange={() => {
          (setIsOpen(false), setSelectedSlot(null));
        }}
      />
      <div className="flex h-540">
        <div className="h-full  px-1.5">
          {hours.map((hour, index) => {
            return (
              <div key={index} className="h-22.5">
                <p className="pt-[2px] font-medium text-[13px]">{hour}</p>
              </div>
            );
          })}
        </div>
        <div className="h-full flex-1 [&>*:nth-child(4n+1)]:border-t-border relative">
          {appoinments.map((appointment) => {
            const servicesNames = appointment.services
              .map((s) => s.service.name)
              .join(" ");
            return (
              <div
                className="absolute z-20 w-full p-px group"
                key={appointment.id}
                style={{
                  top: `${appointment.startMin * 1.5}px`,
                  height: `${(appointment.endMin - appointment.startMin) * 1.5}px`,
                }}
              >
                <ContextMenu>
                  <ContextMenuTrigger className="cursor-pointer h-full w-full bg-[color-mix(in_srgb,var(--primary)_40%,var(--background))] rounded-sm transition-all group-hover:ring-2 group-hover:ring-primary py-1 px-2">
                    <p className="text-sm font-medium">
                      {formatDurationMin(appointment.startMin)}-
                      {formatDurationMin(appointment.endMin)}
                      <span className="font-bold">
                        {" "}
                        {appointment.client
                          ? appointment.client.name
                          : "Walk-in"}
                      </span>
                    </p>
                    <p className="text-sm font-medium truncate">
                      {servicesNames}
                    </p>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem
                      variant="destructive"
                      onClick={() => {
                        mutate({ appoinmentId: appointment.id });
                      }}
                    >
                      Delete
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </div>
            );
          })}
          {slots.map((slot, index) => {
            const isSelectedSlot = index === selectedSlot;
            return (
              <div
                key={index}
                className={cn(
                  "h-[22.5px] border-x border-t border-t-border/40 flex items-center justify-center group p-px  ",
                  isInWorkSlots(index * 15)
                    ? ""
                    : "bg-muted bg-[repeating-linear-gradient(45deg,var(--color-border)_0px,var(--color-border)_0.6px,transparent_0.5px,transparent_6px)]",
                )}
              >
                <Button
                  onClick={() => {
                    setIsOpen(true);
                    setSelectedSlot(index);
                  }}
                  className={cn(
                    "w-full h-full  rounded-[4px]  group-hover:opacity-100  font-normal transition-opacity  hover:bg-[color-mix(in_srgb,var(--primary)_10%,var(--background))]",
                    isSelectedSlot
                      ? "bg-background hover border-primary border-2 ring-1 ring-primary/30 font-medium "
                      : "opacity-0  bg-[color-mix(in_srgb,var(--primary)_10%,var(--background))]  border-border ",
                  )}
                >
                  <span className="text-start w-full text-[13px]  text-primary">
                    {slot}
                    {isSelectedSlot && "-" + slots[(index + 1) % 96]}
                  </span>
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
