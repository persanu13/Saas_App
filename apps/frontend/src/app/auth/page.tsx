import { LinkCard } from "@/components/my-ui/link-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { Fragment } from "react/jsx-runtime";

export default function AuthPage() {
  return (
    <Fragment>
      <h1 className="text-center text-2xl font-semibold  tracking-tighter ">
        Sign up/log in
      </h1>
      <div className="flex flex-col gap-4 w-full">
        <LinkCard
          href="/auth/client"
          title="Trimly for customers"
          description="Book salons and spas near you"
        ></LinkCard>
        <LinkCard
          href="/pagina-ta"
          title="Trimly for professionals"
          description="Manage and grow your business"
        ></LinkCard>
      </div>
    </Fragment>
  );
}
