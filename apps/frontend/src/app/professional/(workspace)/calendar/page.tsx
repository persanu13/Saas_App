"use client";
import { getCalendar } from "@/api/calendar";
import { useAuthStore } from "@/common/stores/auth.store";
import { Calendar } from "@/components/professional/calendar";
import CalendarView from "@/components/professional/calendar-view";
import { Schedule } from "@/components/professional/schedule";
import SelectMember from "@/components/professional/select-member";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  ArrowDown01Icon,
  CalendarAdd01Icon,
  CalendarRemove02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function CalendarPage() {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex p-4 bg-secondary border-b border-border shadow-2xs justify-between shrink-0">
        <div className="flex gap-4">
          <Calendar />
          <SelectMember />
        </div>

        <div className="flex gap-4">
          <CalendarView />
          <Popover>
            <PopoverTrigger render={<Button />}>
              Add
              <HugeiconsIcon className="[svg]:size-4" icon={ArrowDown01Icon} />
            </PopoverTrigger>
            <PopoverContent className="w-fit gap-0">
              <Button
                variant="ghost"
                size="lg"
                className="flex gap-2 justify-start"
              >
                <HugeiconsIcon
                  className="[svg]:size-5"
                  icon={CalendarAdd01Icon}
                />
                <span>Appointment</span>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="flex gap-2 justify-start"
              >
                <HugeiconsIcon
                  className="[svg]:size-5"
                  icon={CalendarRemove02Icon}
                />
                <span>Blocked time</span>
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Schedule></Schedule>
    </div>
  );
}
