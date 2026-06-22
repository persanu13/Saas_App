import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  [
    "w-full min-w-0 rounded-lg border transition-colors outline-none",
    "placeholder:text-muted-foreground",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
    "dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
    "file:inline-flex",
    "file:border-0",
    "file:bg-transparent",
    "file:text-sm",
    "file:font-medium",
    "file:text-foreground",
    "border-input bg-transparent dark:bg-input/30 disabled:bg-input/50 dark:disabled:bg-input/80",
  ],
  {
    variants: {
      variant: {
        default:
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        secondary: "focus-visible:border-primary  ",
      },

      i_size: {
        default: "h-8 px-2.5 py-1 md:text-sm",
        large: "h-12 px-4  ",
      },
    },

    defaultVariants: {
      variant: "secondary",
      i_size: "default",
    },
  },
);

function Input({
  className,
  type,
  variant,
  i_size,
  ...props
}: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        inputVariants({
          variant,
          i_size,
        }),
        className,
      )}
      {...props}
    />
  );
}

export { Input };
