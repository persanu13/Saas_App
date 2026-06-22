"use client";
import { Header } from "@/components/auth/header";
import { useAuth } from "@/common/contexts/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Fragment } from "react/jsx-runtime";
import { LoginForm } from "@/components/auth/login-form";

export default function ProfessionalLoginPage() {
  const router = useRouter();
  const { email, setEmail } = useAuth();
  const searchParams = useSearchParams();
  const prefillEmail = searchParams.get("email");

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
        title="Welcome back"
        description={`Enter your password and login as ${email}`}
      />
      <LoginForm userType="PROFESSIONAL" />
    </Fragment>
  );
}
