"use client";

import * as React from "react";
import { format } from "date-fns";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import type { VariantProps } from "class-variance-authority";

import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps extends VariantProps<typeof buttonVariants> {
  value?: Date | null;
  formatString?: string;
  onChange?: (date: Date | null) => void;
  className?: string;
  allowNever?: boolean;
  neverLabel?: string;
  disabled?: (date: Date) => boolean;
}

export function DatePicker({
  value,
  formatString = "EEE dd MMM",
  onChange,
  className,
  variant = "outline",
  size,
  allowNever = false,
  neverLabel = "Never",
  disabled,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | null>(value ?? null);

  React.useEffect(() => {
    setDate(value ?? null);
  }, [value]);

  const handleSelect = (d: Date | undefined) => {
    if (!d) return;
    setDate(d);
    onChange?.(d);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDate(null);
    onChange?.(null);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant={variant}
            size={size}
            className={cn("w-40  font-normal", className)}
          >
            <span className="flex-1 ">
              {date ? format(date, formatString) : neverLabel}
            </span>
            {allowNever && date && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                className="ml-2 rounded-sm hover:bg-muted p-0.5"
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  strokeWidth={2}
                  className="size-4"
                />
              </span>
            )}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0">
        {allowNever && (
          <div className="border-b p-1">
            <Button
              variant="ghost"
              className="w-full justify-start font-normal"
              onClick={() => {
                setDate(null);
                onChange?.(null);
                setOpen(false);
              }}
            >
              {neverLabel}
            </Button>
          </div>
        )}
        <Calendar
          weekStartsOn={1}
          mode="single"
          selected={date ?? undefined}
          onSelect={handleSelect}
          defaultMonth={date ?? new Date()}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
}
