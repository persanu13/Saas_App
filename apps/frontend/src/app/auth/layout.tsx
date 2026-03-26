"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";

import Image from "next/image";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { AuthProvider } from "@/contexts/auth-context";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col lg:flex-row">
        <main className="flex flex-col  gap-3 w-full  px-3 py-4 lg:px-6 lg:w-1/2 ">
          <Button
            variant="ghost"
            size="icon-lg"
            className="cursor-pointer rounded-full"
            onClick={() => router.back()}
          >
            <HugeiconsIcon className="size-7" icon={ArrowLeft02Icon} />
          </Button>
          <section className="flex flex-col gap-8 max-w-md  w-full mx-auto lg:mt-6 px-3">
            {children}
          </section>
        </main>
        <aside className="relative hidden lg:block lg:w-1/2">
          <Image
            src="/auth.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
        </aside>
      </div>
    </AuthProvider>
  );
}
