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
import { MoreVerticalSquare01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ServiceDetail } from "./service-detail";
import { Fragment, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@/lib/axios";
import { toast } from "sonner";
import { formatDurationMin } from "@/lib/utils";

export function ServiceCard({
  service,
  onEdit,
}: {
  service: Service;
  onEdit?: (service: Service) => any;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (id: number) => deleteService(id),
    onSuccess: (res) => {
      toast.success("Service deleted succesful!");
      queryClient.invalidateQueries({
        queryKey: ["organization_services"],
      });
    },
    onError: (err: ApiError) => {
      toast.error(err.details.message);
    },
  });
  return (
    <Fragment>
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Permanently delete service</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete this service?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                setDeleteOpen(false);
                mutate(service.id);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Card
        className="flex flex-row mx-auto w-full h-22 border-l-primary/50 border-l-10 pr-5 cursor-pointer hover:bg-accent/50"
        onClick={() => onEdit?.(service)}
      >
        <CardContent className="flex flex-col justify-center h-full w-full">
          <CardTitle>{service.name}</CardTitle>
          <CardDescription>
            {formatDurationMin(service.durationMin)} min
          </CardDescription>
          <CardDescription>{service.description}</CardDescription>
        </CardContent>
        <CardAction className="flex items-center  h-full gap-2">
          <span className="text-nowrap text-base font-medium">
            RON {service.price}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  className="rounded-full h-10 w-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <HugeiconsIcon
                    className="[&_svg]:size-4"
                    icon={MoreVerticalSquare01Icon}
                  />
                </Button>
              }
            />

            <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={() => onEdit?.(service)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setDeleteOpen(true)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </Card>
    </Fragment>
  );
}
