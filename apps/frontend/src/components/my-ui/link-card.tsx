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
    <Link href={href}>
      <Card className="hover:shadow-md  transition-shadow cursor-pointer flex flex-row">
        <CardHeader className=" w-full lg:w-8/10">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="hidden lg:flex justify-end items-center w-2/10  ">
          <HugeiconsIcon className="size-5.5 " icon={ArrowRight02Icon} />
        </CardContent>
      </Card>
    </Link>
  );
}
