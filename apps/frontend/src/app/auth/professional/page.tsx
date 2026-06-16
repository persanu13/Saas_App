import { EmailForm } from "@/components/auth/email-form";
import { Header } from "@/components/auth/header";
import { SocialButton, SocialButtons } from "@/components/auth/social-buttons";
import { TextSeparator } from "@/components/my-ui/text-separator";
import { Button } from "@/components/ui/button";

import { Facebook02Icon, GoogleIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Fragment } from "react/jsx-runtime";

export default function ProffesionalAuthPage() {
  const socialsButtons: SocialButton[] = [
    { provider: "google", icon: GoogleIcon },
    { provider: "facebook", icon: Facebook02Icon },
  ];

  return (
    <Fragment>
      <Header
        title="Trimly for Proffesional"
        description="Create an account or log in to manage your business."
      />
      <EmailForm userType="PROFESSIONAL" />
      <TextSeparator text="OR" />
      <SocialButtons buttons={socialsButtons} userType="PROFESSIONAL" />
      <div>
        <h2 className="text-center font-semibold text-base">
          Are you a customer looking to book an appointment ?
        </h2>
        <Button
          className="w-full"
          nativeButton={false}
          variant="link"
          render={<Link href="/auth/customer" />}
        >
          Go to Trimly for customers
        </Button>
      </div>
    </Fragment>
  );
}
