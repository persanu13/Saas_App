"use client";
import { HugeiconsIcon } from "@hugeicons/react";
import { ButtonGroup } from "../ui/button-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { ArrowDown01Icon, Refresh01Icon } from "@hugeicons/core-free-icons";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const VALID_VIEWS = ["day", "week"];

export default function CalendarView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const view = searchParams.get("view");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!view || !VALID_VIEWS.includes(view)) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("view", "day");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [view, router, pathname, searchParams]);

  return (
    <ButtonGroup>
      <Tooltip>
        <TooltipTrigger
          delay={0}
          render={
            <Button
              variant="outline"
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("view", "day");
                router.replace(`${pathname}?${params.toString()}`);
              }}
            />
          }
        >
          <HugeiconsIcon className="[svg]:size-4" icon={Refresh01Icon} />
        </TooltipTrigger>
        <TooltipContent>Reset view</TooltipContent>
      </Tooltip>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button variant="outline">
              <span>{view?.toUpperCase()}</span>
              <HugeiconsIcon
                strokeWidth={2}
                className="[svg]:size-4"
                icon={ArrowDown01Icon}
              />
            </Button>
          }
        />
        <PopoverContent className="w-60">
          {VALID_VIEWS.map((val) => {
            return (
              <Button
                key={val}
                variant={val === view ? "secondary" : "ghost"}
                className="flex justify-start"
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("view", val);
                  router.replace(`${pathname}?${params.toString()}`);
                  setOpen(false);
                }}
              >
                {val.toUpperCase()}
              </Button>
            );
          })}
        </PopoverContent>
      </Popover>
    </ButtonGroup>
  );
}
