"use client";
import { Header } from "@/components/auth/header";
import { RegisterForm } from "@/components/auth/register-form";
import { useAuth } from "@/common/contexts/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Fragment } from "react/jsx-runtime";

export default function ProfessionalRegisterPage() {
  const router = useRouter();
  const { email, setEmail } = useAuth();
  const searchParams = useSearchParams();
  const prefillEmail = searchParams.get("email");
  console.log(prefillEmail);
  useEffect(() => {
    if (prefillEmail && !email) {
      setEmail(prefillEmail);
    }
  }, [prefillEmail, email, setEmail]);

  const currentEmail = email || prefillEmail;

  useEffect(() => {
    if (!currentEmail) {
      router.push("/auth/professional");
    }
  }, [currentEmail, router]);

  if (!currentEmail) return null;

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
