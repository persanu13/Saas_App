"use client";

import { useLogout } from "@/common/hooks/use-logout";
import { useAuthStore } from "@/common/stores/auth.store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { mutate: logout, isPending } = useLogout();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Fragment>
      <nav
        className={`h-16 fixed w-screen px-10 transition-all duration-0 z-50 ${
          scrolled
            ? "bg-background backdrop-blur-md shadow-md"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between h-16 max-w-360 m-auto">
          <div className="flex items-center  h-full  ">
            <Button
              variant="link"
              className="font-black text-2xl text-foreground hover:no-underline tracking-tight p-0"
              onClick={() => {
                router.push("/");
              }}
            >
              trimly
            </Button>
          </div>
          <div className="flex items-center justify-center h-full mx-5">
            {user && user.type === "CUSTOMER" ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="outline">
                      <span className="text-bold text-base">Menu</span>
                      <HugeiconsIcon strokeWidth={2} icon={ArrowDown01Icon} />
                    </Button>
                  }
                ></DropdownMenuTrigger>
                <DropdownMenuContent className="p-2">
                  <DropdownMenuItem
                    onClick={() => {
                      logout();
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                size="custom-desktop"
                variant="outline"
                onClick={() => {
                  router.push("/auth");
                }}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </nav>

      {children}
    </Fragment>
  );
}
