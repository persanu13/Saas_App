import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { getLastOrganization, Member } from "@/api/organizations";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useLogout } from "@/common/hooks/use-logout";

export function Navbar({ members }: { members: Member[] }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["last-organization"],
    queryFn: getLastOrganization,
  });
  const { mutate: logout, isPending } = useLogout();

  const organization = data?.data;

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
          {organization && (
            <Select value={organization?.id} onValueChange={(value) => {}}>
              <SelectTrigger className="w-fit border-0">
                <SelectValue className="text-bold ">
                  {organization.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {members &&
                    members.map((m) => {
                      return (
                        <SelectItem key={m.id} value={m.organizationId}>
                          {m.organization?.name}
                        </SelectItem>
                      );
                    })}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="flex items-center justify-center h-full mx-5">
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
        </div>
      </div>
    </header>
  );
}
