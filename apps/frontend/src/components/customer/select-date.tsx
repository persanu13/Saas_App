"use client";

import { Day, getAvailability } from "@/api/organizations";
import { Service } from "@/api/services";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
import { formatMinutes } from "@/lib/utils";
import clsx from "clsx";
import { DayAndTime } from "./make-appoinment";

const formatParts = (dateStr: string) => {
  const date = new Date(dateStr);

  const weekday = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
  }).format(date);

  const day = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
  }).format(date);

  const month = new Intl.DateTimeFormat("en-GB", {
    month: "short",
  }).format(date);

  return { weekday, day, month };
};

type Props = {
  selectedServices: Service[];
  selectedTime: DayAndTime | null;
  setSelectedTime: Dispatch<SetStateAction<DayAndTime | null>>;
};

export function SelectDate({
  selectedServices,
  selectedTime,
  setSelectedTime,
}: Props) {
  const [selectedDay, setSelectedDate] = useState<Day | null>(null);

  const [api, setApi] = useState<any>(null);
  const { data, isLoading, error } = useQuery({
    queryKey: ["availability", selectedServices],
    queryFn: () => getAvailability(selectedServices),
    enabled: selectedServices.length > 0,
  });

  const days = data?.data;

  useEffect(() => {
    if (!days || days.length === 0) return;
    setSelectedDate(days[0]);
  }, [days]);

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-4xl font-black mb-8">Select date and time</h1>
      <div className="flex items-center justify-between">
        <p className="font-bold text-base">Select a date</p>
        <div>
          <Button
            variant="ghost"
            className="rounded-full size-10"
            onClick={() => {
              if (!api) return;
              const current = api.selectedScrollSnap();
              api.scrollTo(current - 7);
            }}
          >
            <HugeiconsIcon strokeWidth={2} icon={ArrowLeft01Icon} />
          </Button>
          <Button
            variant="ghost"
            className="rounded-full size-10"
            onClick={() => {
              if (!api) return;
              const current = api.selectedScrollSnap();
              api.scrollTo(current + 7);
            }}
          >
            <HugeiconsIcon strokeWidth={2} icon={ArrowRight01Icon} />
          </Button>
        </div>
      </div>
      <div className="w-full max-w-full overflow-hidden mt-1">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2">
            {days?.map((d) => {
              const { weekday, day, month } = formatParts(d.date);
              return (
                <CarouselItem key={d.date} className="pl-2 basis-1/7">
                  <Button
                    variant={d === selectedDay ? "default" : "outline"}
                    size="custom-desktop"
                    className="w-fit flex flex-col h-fit py-3 px-5 gap-0"
                    disabled={d.startMin.length <= 0}
                    onClick={() => setSelectedDate(d)}
                  >
                    <span className="text-sm font-normal ">{weekday}</span>
                    <span className="text-2xl font-bold">{day}</span>
                    <span className="text-sm font-normal ">{month}</span>
                  </Button>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
      <div className="flex flex-col mt-8">
        <p className="font-bold text-base">Pick a time</p>
        <div className="flex flex-col w-full gap-4 mt-4">
          {selectedDay?.startMin.map((value, index) => {
            const isSelected =
              selectedDay.date === selectedTime?.date &&
              value === selectedTime.startMin;
            return (
              <Button
                key={index}
                variant="outline"
                className={clsx(
                  "p-8 text-base justify-start",
                  isSelected && "ring-primary ring-2",
                )}
                onClick={() => {
                  setSelectedTime({ date: selectedDay.date, startMin: value });
                }}
              >
                {formatMinutes(value)}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
