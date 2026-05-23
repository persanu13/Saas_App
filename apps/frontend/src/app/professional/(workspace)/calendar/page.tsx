"use client";
import { DatePicker } from "@/components/my-ui/date-picker";
import { Schedule } from "@/components/professional/schedule";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  CalendarAdd01Icon,
  CalendarRemove02Icon,
  Refresh01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

const TEAM = ["John Smith", "Max Penth", "Alexa Ston"];

export default function CalendarPage() {
  const [teamMember, setTeamMember] = useState<string>("John Smith");
  const [calendarMode, setCalendarMode] = useState<string>("day");

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex p-4 bg-secondary border-b border-border shadow-2xs justify-between">
        <div className="flex gap-4">
          <Button variant="outline">Today</Button>
          <ButtonGroup>
            <Button variant="outline">
              <HugeiconsIcon className="[svg]:size-4" icon={ArrowLeft01Icon} />
            </Button>
            <DatePicker
              value={new Date("2024-01-15")}
              onChange={(date) => console.log(date)}
            />
            <Button variant="outline">
              <HugeiconsIcon className="[svg]:size-4" icon={ArrowRight01Icon} />
            </Button>
          </ButtonGroup>
          <Select
            value={teamMember}
            onValueChange={(name) => {
              setTeamMember(name!);
            }}
          >
            <SelectTrigger variant="outline" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {TEAM.map((e) => (
                  <SelectItem key={e} value={e}>
                    {e}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4">
          <ButtonGroup>
            <Tooltip>
              <TooltipTrigger delay={0} render={<Button variant="outline" />}>
                <HugeiconsIcon className="[svg]:size-4" icon={Refresh01Icon} />
              </TooltipTrigger>
              <TooltipContent>Reset view</TooltipContent>
            </Tooltip>
            <Select
              value={calendarMode}
              onValueChange={(value) => {
                setCalendarMode(value!);
              }}
            >
              <SelectTrigger variant="outline" className="w-20">
                <SelectValue className="capitalize" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="day" label="Day">
                    Day
                  </SelectItem>
                  <SelectItem value="week" label="Week">
                    Week
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </ButtonGroup>
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
