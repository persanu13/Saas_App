import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";

export function Navbar() {
  return (
    <header className="border-b sticky h-16 top-0 z-50 bg-background backdrop-blur ">
      <div className="px-5 flex items-center justify-between h-16 w-full">
        <div className="flex items-center  h-full  ">
          <Link href={"/"}>
            <Button
              variant="link"
              className="font-black text-2xl text-foreground hover:no-underline tracking-tight"
            >
              trimly
            </Button>
          </Link>
          <Separator orientation="vertical" className="mx-4 h-6 my-auto" />
          <Button variant="ghost">
            <span>Bliss</span>
            <HugeiconsIcon
              strokeWidth={2}
              className="[svg]:size-4 "
              icon={ArrowDown01Icon}
            />
          </Button>
        </div>
        <div className="flex items-center justify-center h-full mx-5">
          <Button className="rounded-full  size-12 bg-primary/10 hover:bg-primary/20">
            <span className="text-primary font-bold text-base">TS</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
