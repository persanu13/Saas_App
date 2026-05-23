import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { Button } from "../ui/button";
import { HugeiconsIcon } from "@hugeicons/react";

type CardLinkProps = {
  href: string;
  title: string;
  description?: string;
};

export function LinkCard({ href, title, description }: CardLinkProps) {
  return (
    <Link href={href} className="">
      <Card className="h-full hover:shadow-md  transition-shadow cursor-pointer flex flex-row min-h-18 items-center">
        <CardHeader className=" w-full lg:w-9/10">
          <CardTitle className="text-[16px] tracking-tight">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="lg:flex justify-end items-center w-1/10 p-0 pr-4">
          <HugeiconsIcon className="size-5.5 " icon={ArrowRight02Icon} />
        </CardContent>
      </Card>
    </Link>
  );
}
