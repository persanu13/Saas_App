"use client";
import { useInitAuth } from "@/common/hooks/use-init-auth";
import { useAuthStore } from "../stores/auth.store";

export const AuthInitializer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isLoading } = useAuthStore();
  useInitAuth();

  if (isLoading) return <div>Loading...</div>;

  return <>{children}</>;
};
