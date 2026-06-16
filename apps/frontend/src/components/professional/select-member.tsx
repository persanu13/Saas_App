import { HugeiconsIcon } from "@hugeicons/react";
import { ButtonGroup } from "../ui/button-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import {
  ArrowDown01Icon,
  CheckmarkCircle01Icon,
  Refresh01Icon,
} from "@hugeicons/core-free-icons";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useQuery } from "@tanstack/react-query";
import { getOrganizationMembers } from "@/api/organizations";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/common/contexts/auth-context";
import { useAuthStore } from "@/common/stores/auth.store";

export default function SelectMember() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();
  const memberId = searchParams.get("member_id");

  const { data, isLoading, error } = useQuery({
    queryKey: ["organization_members"],
    queryFn: getOrganizationMembers,
  });

  const members = data?.data ?? [];
  const currentMember = members.find((m: any) => m.id === Number(memberId));
  useEffect(() => {
    if (!isLoading && members.length > 0 && !currentMember) {
      const params = new URLSearchParams(searchParams.toString());
      const meMember = members.find((m: any) => m.userId == user?.sub);
      params.set("member_id", String(meMember.id));
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [isLoading, members, currentMember, router, pathname, searchParams]);

  if (isLoading)
    return (
      <Button variant="outline" disabled>
        Loading...
      </Button>
    );

  if (error) {
    return (
      <Button variant="outline" disabled>
        Error
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline">
            <span>{currentMember?.name}</span>
            <HugeiconsIcon
              strokeWidth={2}
              className="[svg]:size-4"
              icon={ArrowDown01Icon}
            />
          </Button>
        }
      />
      <PopoverContent className="w-fit">
        {members?.map((member: any) => {
          if (member.id === currentMember?.id) {
            return (
              <Button variant="outline" key={member.id}>
                {member?.name}
                <HugeiconsIcon icon={CheckmarkCircle01Icon} />
              </Button>
            );
          }
          return (
            <Button variant="ghost" key={member.id}>
              {member?.name}
            </Button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
