"use client";
import { Header } from "@/components/auth/header";
import { RegisterForm } from "@/components/auth/register-form";
import { useAuth } from "@/common/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Fragment } from "react/jsx-runtime";

export default function CustomerRegisterAuthPage() {
  const router = useRouter();
  const { email } = useAuth();

  useEffect(() => {
    if (!email) {
      router.push("/auth/customer");
    }
  }, [email]);

  if (!email) return null;

  return (
    <Fragment>
      <Header
        title="Create customer account"
        description={`You're almost there! Create your new account for ${email} by completing these details`}
      />

      <RegisterForm />
    </Fragment>
  );
}
