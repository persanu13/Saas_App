"use client";
import { Member } from "@/api/organizations";
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
import { formatDurationMin } from "@/lib/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";

export function MemberAvatar({ member }: { member: Member }) {
  const initials = member.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
  return (
    <div className="flex flex-col  items-center gap-4 w-30">
      <Avatar className="size-30 border-primary/80 border-2 p-1">
        <AvatarFallback className="bg-primary/10 hover:bg-primary/20  text-primary font-bold text-3xl">
          {initials}
        </AvatarFallback>
      </Avatar>
      <p className="font-bold text-s">{member.name.split(" ")[1]}</p>
    </div>
  );
}
