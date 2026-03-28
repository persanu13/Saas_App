"use client";
import { resendEmail, verifyEmail } from "@/api/auth/register";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/common/contexts/auth-context";
import { ApiError } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Fragment } from "react/jsx-runtime";
import { toast } from "sonner";
import { useCooldown } from "@/common/hooks/use-cooldown";
import { useSearchParams } from "next/navigation";

export default function EmailVerificationPage() {
  const router = useRouter();
  const { email } = useAuth();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const paramEmail = searchParams.get("email");
  const { cooldown, setCooldown, isFinished } = useCooldown();
  const currentEmail = email ?? paramEmail;

  useEffect(() => {
    if (!currentEmail) {
      router.push("/auth/customer");
    }
  }, [currentEmail]);

  const { isSuccess, isError } = useQuery({
    queryKey: ["verify-email", token],
    queryFn: () => verifyEmail(token!),
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Email verified successfully!");
      router.push("/auth/customer/login");
    }
    if (isError) {
      toast.error("Invalid or expired token.");
    }
  }, [isSuccess, isError]);

  const { mutate, isPending } = useMutation({
    mutationFn: resendEmail,
    onSuccess: (res) => {
      toast.success(res.data.message);
      setCooldown(30);
    },
    onError: (err: ApiError) => {
      if (err.statusCode === 429) setCooldown(err.details.retryAfter || 0);
      toast.error(err.details.message);
    },
  });

  if (!currentEmail) return null;

  return (
    <Fragment>
      <header>
        <h1 className="text-3xl font-semibold mb-4 tracking-tighter">
          Verify your email
        </h1>
        <p className="text-muted-foreground text-base text-justify">
          {token
            ? "Verifying your email..."
            : `We've sent a verification code to ${currentEmail}. Please check your inbox and enter the code below.`}
        </p>
      </header>
      {!token && (
        <p className="text-base">
          Didn't receive the email?{" "}
          <Button
            variant="link"
            type="button"
            disabled={isPending || !isFinished}
            onClick={() => mutate({ email: currentEmail, type: "CUSTOMER" })}
          >
            {!isFinished ? `Resend in ${cooldown}s` : "Resend email"}
          </Button>
        </p>
      )}
    </Fragment>
  );
}
