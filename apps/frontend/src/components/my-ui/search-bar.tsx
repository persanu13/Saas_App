"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  Cancel01Icon,
  CancelCircleIcon,
} from "@hugeicons/core-free-icons";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const searchBarVariants = cva("relative flex items-center ", {
  variants: {
    variant: {
      default: "[&_input]:focus:border-primary  [&_input]:focus:ring-0",
      ghost:
        "[&_input]:border-none [&_input]:bg-transparent [&_input]:shadow-none [&_input]:focus:ring-0",
    },
    size: {
      sm: "[&_input]:h-8 [&_input]:text-sm",
      default: "[&_input]:h-9",
      lg: "[&_input]:h-12 ",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface SearchBarProps
  extends
    Omit<React.ComponentProps<typeof Input>, "value" | "onChange" | "size">,
    VariantProps<typeof searchBarVariants> {
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
}

export function SearchBar({
  value,
  onChange,
  onClear,
  variant,
  size,
  className,
  placeholder = "Search...",
  ...props
}: SearchBarProps) {
  const [internalValue, setInternalValue] = React.useState("");

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue("");
    }
    onChange?.("");
    onClear?.();
  };

  return (
    <div className={cn(searchBarVariants({ variant, size }), className)}>
      <HugeiconsIcon
        icon={Search01Icon}
        className="text-foreground absolute left-4 top-1/2 -translate-y-1/2 size-5  pointer-events-none"
      />
      <Input
        placeholder={placeholder}
        value={currentValue}
        onChange={handleChange}
        className="pl-12 pr-8"
        {...props}
      />
      {currentValue && (
        <Button
          type="button"
          variant="ghost"
          onClick={handleClear}
          size="icon-sm"
          className="absolute right-3 top-1/2 -translate-y-1/2 size-6 p-0 hover:bg-transparent active:-translate-y-1/2"
        >
          <HugeiconsIcon icon={CancelCircleIcon} className="size-4.5" />
        </Button>
      )}
    </div>
  );
}
