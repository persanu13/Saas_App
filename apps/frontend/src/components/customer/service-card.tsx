"use client";
import { deleteService, Service } from "@/api/services";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, formatDurationMin } from "@/lib/utils";
import { Add01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function ServiceCard({
  service,
  isSelected = false,
  variant = "default",
  onClick,
}: {
  service: Service;
  isSelected?: boolean;
  variant?: "full" | "default";
  onClick?: (service: Service) => void;
}) {
  return (
    <Card
      className={cn(
        "flex flex-row mx-auto w-full  px-5 cursor-pointer hover:bg-accent/50",
        isSelected && "border-primary border-2",
      )}
      onClick={() => {
        onClick?.(service);
      }}
    >
      <CardContent className="flex flex-col justify-center h-full w-full px-0">
        <CardTitle>{service.name}</CardTitle>
        <CardDescription>
          {formatDurationMin(service.durationMin)}
        </CardDescription>
        {variant === "full" && (
          <CardDescription className="mt-2">
            {service.description}
          </CardDescription>
        )}
        <p className="text-nowrap  font-medium mt-3">
          from RON {service.price}
        </p>
      </CardContent>
      <CardAction
        className={cn(
          "flex items-center  h-full gap-2",
          variant === "full" && "items-end",
        )}
      >
        {variant === "default" ? (
          <Button size="lg" variant="outline">
            Book
          </Button>
        ) : !isSelected ? (
          <Button size="icon-lg" variant="outline" className="rounded-full">
            <HugeiconsIcon
              strokeWidth={2}
              className="[svg]:size-5"
              icon={Add01Icon}
            />
          </Button>
        ) : (
          <Button size="icon-lg" className="rounded-full">
            <HugeiconsIcon
              strokeWidth={2}
              className="[svg]:size-5"
              icon={Tick02Icon}
            />
          </Button>
        )}
      </CardAction>
    </Card>
  );
}
