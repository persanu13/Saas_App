"use client";
import { Navbar } from "@/components/professional/navbar";
import { Fragment, useEffect } from "react";
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

  useEffect(() => {
    if (!user || user.type !== "PROFESSIONAL") {
      router.push("/auth");
    }
  }, [user, router]);

  useEffect(() => {
    if (
      data?.data.organizations.length === 0 &&
      !pathname.includes("/professional/account-type")
    ) {
      router.push("/professional/account-type");
    }
  }, [data]);

  if (!user || user.type !== "PROFESSIONAL") return null;

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      {children}
    </div>
  );
}
