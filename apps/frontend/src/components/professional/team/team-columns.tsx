"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Member } from "@/api/organizations";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { ShiftDetail } from "./shift-details";

export const teamColumns: ColumnDef<Member>[] = [
  {
    accessorKey: "name",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-bold text-[14px]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <HugeiconsIcon
            strokeWidth={2}
            className="[svg]:size-4"
            icon={ArrowDown01Icon}
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue("name") as string;

      const initials = name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("");
      return (
        <div className="flex items-center gap-4  ">
          <Avatar className="size-16 border-primary/80 border-2 p-1">
            <AvatarFallback className="bg-primary/10 hover:bg-primary/20  text-primary font-bold text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <p className=" font-bold text-s">{name}</p>
        </div>
      );
    },
  },
  {
    id: "contact",
    header: () => <p className="text-bold ">Contact</p>,
    cell: ({ row }) => {
      const member = row.original;

      return (
        <div className="flex flex-col text-muted-foreground">
          <p>{member.email}</p>
          {member.phone && <p>{member.phone}</p>}
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: () => <p className="text-bold ">Permision role</p>,
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return <p className="font-mediu">{role}</p>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [open, setOpen] = useState<boolean>(false);
      const member = row.original;

      return (
        <Fragment>
          <ShiftDetail
            open={open}
            onOpenChange={setOpen}
            member={member}
          ></ShiftDetail>
          <div className="flex justify-end pr-2">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" className="w-fit ">
                    <span className="">Actions</span>
                    <HugeiconsIcon
                      strokeWidth={2}
                      className="[svg]:size-4"
                      icon={ArrowDown01Icon}
                    />
                  </Button>
                }
              ></DropdownMenuTrigger>
              <DropdownMenuContent className="w-fit">
                <DropdownMenuItem>View Calendar</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpen(true)}>
                  Edit schedule shifts
                </DropdownMenuItem>
                {member.role != "OWNER" && (
                  <Fragment>
                    <DropdownMenuItem>Edit member role</DropdownMenuItem>
                    <DropdownMenuItem variant="destructive">
                      Delete
                    </DropdownMenuItem>
                  </Fragment>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Fragment>
      );
    },
  },
];
