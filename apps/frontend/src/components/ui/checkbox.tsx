"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";

import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";

import { cva, type VariantProps } from "class-variance-authority";

const checkboxVariants = cva(
  [
    "peer relative shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors outline-none",
    "group-has-disabled/field:opacity-50",
    "after:absolute after:-inset-x-3 after:-inset-y-2",
    "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
    "aria-invalid:aria-checked:border-primary",
    "dark:bg-input/30",
    "dark:aria-invalid:border-destructive/50",
    "dark:aria-invalid:ring-destructive/40",
    "data-checked:border-primary",
    "data-checked:bg-primary",
    "data-checked:text-primary-foreground",
    "dark:data-checked:bg-primary",
    "flex",
  ],
  {
    variants: {
      size: {
        default: "size-4",
        large: "size-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);
function Checkbox({
  className,
  size,
  ...props
}: CheckboxPrimitive.Root.Props & VariantProps<typeof checkboxVariants>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        checkboxVariants({
          size,
        }),
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className={cn(
          "grid place-content-center text-current transition-none",
          size === "large" ? "[&>svg]:size-4" : "[&>svg]:size-3.5",
        )}
      >
        <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
