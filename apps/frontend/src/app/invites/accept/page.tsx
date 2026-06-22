"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/common/stores/auth.store";
import { useLogout } from "@/common/hooks/use-logout";
import { ApiError } from "@/lib/axios";
import { acceptInvitation } from "@/api/organizations";
import { toast } from "sonner";

export default function AcceptInvitePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const organizationId = searchParams.get("organization_id");
  const { mutate: logout, isPending: isLogoutPending } = useLogout();
  const { user, accessToken, isLoading } = useAuthStore();

  const { mutate, isPending } = useMutation({
    mutationFn: (token: string) => acceptInvitation(token),
    onSuccess: (res) => {
      console.log(res);
      router.push("/professional/calendar");
    },
    onError: (err: ApiError) => {
      console.log(err);
      toast.error(err.details.message);
    },
  });

  if (!token || !email || !organizationId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-xl font-semibold">Invalid invitation link</h1>
        <p className="text-muted-foreground">
          This invitation link is missing required information.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const isLoggedIn = !!user && !!accessToken;
  const redirectPath = `/invites/accept?token=${token}&email=${encodeURIComponent(email)}&organization_id=${organizationId}`;

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">You've been invited</h1>
        <p className="text-muted-foreground text-center max-w-sm">
          Sign in or create an account with <strong>{email}</strong> to accept
          this invitation.
        </p>
        <div className="flex gap-2">
          <Button size="custom-desktop">
            <a
              href={`/auth/professional/login?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(redirectPath)}`}
            >
              Sign in
            </a>
          </Button>
          <Button variant="outline" size="custom-desktop">
            <a
              href={`/auth/professional/register?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(redirectPath)}`}
            >
              Create account
            </a>
          </Button>
        </div>
      </div>
    );
  }

  if (user.email !== email) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-xl font-semibold">Wrong account</h1>
        <p className="text-muted-foreground text-center max-w-sm">
          This invitation was sent to <strong>{email}</strong>, but you're
          signed in as <strong>{user.email}</strong>.
        </p>
        <Button variant="outline" onClick={() => logout()} disabled={isPending}>
          Sign out and try again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-xl font-semibold">Accept invitation</h1>
      <p className="text-muted-foreground text-center max-w-sm">
        You've been invited to join an organization. Click below to accept.
      </p>
      <Button
        size="custom-desktop"
        onClick={() => mutate(token)}
        disabled={isPending}
      >
        {isPending ? "Accepting..." : "Accept invitation"}
      </Button>
    </div>
  );
}
