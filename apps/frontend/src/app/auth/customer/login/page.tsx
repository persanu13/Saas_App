"use client";
import { Header } from "@/components/auth/header";
import { useAuth } from "@/common/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Fragment } from "react/jsx-runtime";
import { LoginForm } from "@/components/auth/login-form";

export default function CustomerLoginPage() {
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
        title="Welcome back"
        description={`Enter your password and login as ${email}`}
      />
      <LoginForm userType="CUSTOMER" />
    </Fragment>
  );
}
