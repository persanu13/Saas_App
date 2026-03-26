import { EmailForm } from "@/components/auth/email-form";
import { LinkCard } from "@/components/my-ui/link-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight02Icon,
  Facebook02Icon,
  GoogleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { Fragment } from "react/jsx-runtime";

export default function ClientAuthPage() {
  return (
    <Fragment>
      <header>
        <h1 className="text-center text-2xl font-semibold mb-4 tracking-tighter ">
          Trimly for customers
        </h1>
        <p className="text-muted-foreground text-sm text-center">
          Create an account or log in to book and manage your appointments.
        </p>
      </header>

      <div className="flex flex-col items-center gap-3   ">
        <Button variant="outline" size="lg" className="relative w-full p-5">
          <span className="text-base">Continue with Google</span>
          <HugeiconsIcon
            icon={GoogleIcon}
            className="size-5 absolute right-4"
          />
        </Button>
        <Button variant="outline" size="lg" className="relative w-full p-5">
          <span className="text-base">Continue with Facebook</span>
          <HugeiconsIcon
            icon={Facebook02Icon}
            className="size-5 absolute right-4"
          />
        </Button>
      </div>

      <div className="flex items-center gap-4 ">
        <Separator className="flex-1 " />
        <span className="text-sm text-muted-foreground">OR</span>
        <Separator className="flex-1" />
      </div>
      <EmailForm />
      <div>
        <h2 className="text-center font-semibold text-base">
          Have a business account?{" "}
        </h2>
        <Button
          className="w-full"
          nativeButton={false}
          variant="link"
          render={<Link href="/auth" />}
        >
          Sign in as a professional
        </Button>
      </div>
    </Fragment>
  );
}
