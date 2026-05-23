"use client";
import { LinkCard } from "@/components/my-ui/link-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const LINKS = [
  {
    title: "Create a new business",
    href: "/professional/account-type/settup",
  },
  {
    title: "Join an existing business on Trimly",
    description: "Find the business you want to join",
    href: "/auth/professional",
  },
];

export default function AccountTypePage() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col lg:flex-row items-stretch">
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
          <h1 className="text-center text-[22px] font-semibold  tracking-tighter ">
            How would you like to set up your professional account?
          </h1>
          <div className="flex flex-col gap-4 w-full">
            {LINKS.map((link) => {
              return (
                <LinkCard
                  key={link.href}
                  href={link.href}
                  title={link.title}
                  description={link.description}
                ></LinkCard>
              );
            })}
          </div>
        </section>
      </main>
      <aside className="relative hidden lg:block lg:w-1/2">
        <Image src="/auth.jpg" alt="" fill className="object-cover" priority />
      </aside>
    </div>
  );
}
