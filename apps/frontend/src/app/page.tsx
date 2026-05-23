"use client";
import { useAuth } from "@/common/contexts/auth-context";
import { useLogout } from "@/common/hooks/use-logout";
import { useAuthStore } from "@/common/stores/auth.store";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const { user } = useAuthStore();
  const { mutate: logout, isPending } = useLogout();

  return (
    <div>
      <h1>Home Page</h1>
      {user ? (
        <Button onClick={() => logout()} disabled={isPending}>
          {isPending ? "Se deconectează..." : "Logout"}
        </Button>
      ) : (
        <Button
          nativeButton={false}
          variant="link"
          render={<Link href="/auth" />}
        >
          Login
        </Button>
      )}
    </div>
  );
}
