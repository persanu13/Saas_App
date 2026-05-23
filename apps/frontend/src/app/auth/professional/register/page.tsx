"use client";
import { Header } from "@/components/auth/header";
import { RegisterForm } from "@/components/auth/register-form";
import { useAuth } from "@/common/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Fragment } from "react/jsx-runtime";

export default function CustomerRegisterPage() {
  const router = useRouter();
  const { email } = useAuth();

  useEffect(() => {
    console.log(1);
    if (!email) {
      router.push("/auth/professional");
    }
  }, [email]);

  if (!email) return null;

  return (
    <Fragment>
      <Header
        title="Create a professional account"
        description={`You're almost there! Create your new account for ${email} by completing these details`}
      />
      <RegisterForm userType="PROFESSIONAL" />
    </Fragment>
  );
}
