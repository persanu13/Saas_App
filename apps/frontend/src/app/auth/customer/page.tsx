import { EmailForm } from "@/components/auth/email-form";
import { Header } from "@/components/auth/header";
import { SocialButton, SocialButtons } from "@/components/auth/social-buttons";
import { TextSeparator } from "@/components/my-ui/text-separator";
import { Button } from "@/components/ui/button";

import { Facebook02Icon, GoogleIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Fragment } from "react/jsx-runtime";

export default function CustomerAuthPage() {
  const socialsButtons: SocialButton[] = [
    { provider: "google", icon: GoogleIcon },
    { provider: "facebook", icon: Facebook02Icon },
  ];

  return (
    <Fragment>
      <Header
        title="Trimly for customers"
        description="Create an account or log in to book and manage your appointments."
      />
      <SocialButtons buttons={socialsButtons} userType="CUSTOMER" />
      <TextSeparator text="OR" />
      <EmailForm userType="CUSTOMER" />

      <div>
        <h2 className="text-center font-semibold text-base">
          Have a business account?{" "}
        </h2>
        <Button
          className="w-full"
          nativeButton={false}
          variant="link"
          render={<Link href="/auth/professional" />}
        >
          Sign in as a professional
        </Button>
      </div>
    </Fragment>
  );
}
