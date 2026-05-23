"use client";
import { useInitAuth } from "@/common/hooks/use-init-auth";

export const AuthInitializer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isLoading } = useInitAuth();

  if (isLoading) return <div>Loading...</div>;

  return <>{children}</>;
};
