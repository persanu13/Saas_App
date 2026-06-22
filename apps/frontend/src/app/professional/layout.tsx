"use client";

import { Navbar } from "@/components/professional/navbar";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/common/stores/auth.store";
import { useQuery } from "@tanstack/react-query";
import { getMyOrganizations } from "@/api/users/me";

export default function ProfessionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["organizations"],
    queryFn: getMyOrganizations,
    enabled: !!user && user.type === "PROFESSIONAL",
  });

  const members = data?.data?.organizations;
  useEffect(() => {
    if (user === undefined) return;

    if (!user || user.type !== "PROFESSIONAL") {
      router.replace("/auth");
    }
  }, [user, router]);

  useEffect(() => {
    if (
      members &&
      members.length === 0 &&
      !pathname.startsWith("/professional/account-type")
    ) {
      router.replace("/professional/account-type");
    }
  }, [members, pathname, router]);

  if (!user) {
    return <p>Loading...</p>;
  }

  if (user.type !== "PROFESSIONAL") {
    return <p>Redirecting...</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (
    members &&
    members.length === 0 &&
    !pathname.startsWith("/professional/account-type")
  ) {
    return <p>Redirecting...</p>;
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar members={members!} />
      {children}
    </div>
  );
}
