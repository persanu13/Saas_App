"use client";
import { cn, formatDurationMin } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AddCircleIcon,
  Cancel01Icon,
  Cancel02Icon,
  WalkingIcon,
} from "@hugeicons/core-free-icons";
import { SearchBar } from "../my-ui/search-bar";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import {
  Client,
  getOrganizationClients,
  getOrganizationServices,
} from "@/api/organizations";
import { useQuery } from "@tanstack/react-query";
import { getMemberServices, Service } from "@/api/services";
import { useSearchParams } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  setSelectedClient: Dispatch<SetStateAction<Client | null>>;
};

export function SelectClientSheet({
  isOpen,
  onOpenChange,
  setSelectedClient,
}: Props) {
  const [query, setQuery] = useState<string>("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["organization_clients"],
    queryFn: getOrganizationClients,
  });

  const clients = data?.data ?? [];

  const filteredClients = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) return clients ?? [];

    return (clients ?? []).filter((client) =>
      client.user.name.toLowerCase().includes(search),
    );
  }, [clients, query]);

  return (
    <div
      className={cn(
        "fixed right-0 top-0 h-full w-fit z-50 transition-transform duration-200 flex",
        isOpen ? "translate-x-0" : "translate-x-full",
      )}
    >
      <div className="bg-background border-l shadow-xl w-120  flex flex-col pb-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-base font-medium">New appointment</h1>
        </div>
        <div className="flex flex-col px-6 flex-1 min-h-0  mt-6">
          <h1 className="text-2xl font-bold text-foreground">
            Select a Client
          </h1>
          <SearchBar
            size="lg"
            placeholder="Search by client name"
            value={query}
            onChange={setQuery}
            className="my-4 mx-1"
          ></SearchBar>
          <ScrollArea className="flex-1 min-h-0 pr-2">
            <div className="flex flex-col gap-1  ">
              <Button
                variant="ghost"
                className="flex justify-start p-2 h-fit "
                onClick={() => {
                  setSelectedClient(null);
                  onOpenChange(false);
                }}
              >
                <div className="flex items-center gap-4  ">
                  <Avatar className="size-16 border-primary/80 border-2 p-1">
                    <AvatarFallback className="bg-primary/10 hover:bg-primary/20  text-primary font-bold text-lg">
                      <HugeiconsIcon className="size-8" icon={WalkingIcon} />
                    </AvatarFallback>
                  </Avatar>
                  <p className=" font-bold text-s">Walk-In</p>
                </div>
              </Button>
              {isLoading ? (
                <p>Is Loading...</p>
              ) : (
                filteredClients.map((client) => {
                  const name = client.user.name;
                  const initials = name
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0].toUpperCase())
                    .join("");
                  return (
                    <Button
                      variant="ghost"
                      className="flex justify-start p-2 h-fit "
                      key={client.user.id}
                      onClick={() => {
                        setSelectedClient(client);
                        onOpenChange(false);
                      }}
                    >
                      <div className="flex items-center gap-4  ">
                        <Avatar className="size-16 border-primary/80 border-2 p-1">
                          <AvatarFallback className="bg-primary/10 hover:bg-primary/20  text-primary font-bold text-lg">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <p className=" font-bold text-s">{name}</p>
                      </div>
                    </Button>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
