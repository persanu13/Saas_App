import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const textareaVariants = cva(
  [
    "flex w-full field-sizing-content rounded-lg border transition-colors outline-none",
    "placeholder:text-muted-foreground",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
    "dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
    "border-input bg-transparent dark:bg-input/30",
    "disabled:bg-input/50 dark:disabled:bg-input/80",
  ],
  {
    variants: {
      variant: {
        default:
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        secondary: "focus-visible:border-primary",
      },

      i_size: {
        default: "min-h-16 px-2.5 py-2 md:text-sm",
        large: "min-h-32 px-4 py-4 ",
      },
    },

    defaultVariants: {
      variant: "secondary",
      i_size: "default",
    },
  },
);

function Textarea({
  className,
  variant,
  i_size,
  ...props
}: React.ComponentProps<"textarea"> & VariantProps<typeof textareaVariants>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        textareaVariants({
          variant,
          i_size,
        }),
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
