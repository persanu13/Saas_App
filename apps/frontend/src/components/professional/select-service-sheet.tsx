"use client";
import { cn, formatDurationMin } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AddCircleIcon,
  Cancel01Icon,
  Cancel02Icon,
} from "@hugeicons/core-free-icons";
import { SearchBar } from "../my-ui/search-bar";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Client, getOrganizationServices } from "@/api/organizations";
import { useQuery } from "@tanstack/react-query";
import { getMemberServices, Service } from "@/api/services";
import { useSearchParams } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  setSelectedServices: Dispatch<SetStateAction<Service[]>>;
};

export function SelectServiceSheet({
  isOpen,
  onOpenChange,
  setSelectedServices,
}: Props) {
  const [query, setQuery] = useState<string>("");

  const searchParams = useSearchParams();
  const memberId = searchParams.get("member_id");

  const { data, isLoading, error } = useQuery({
    queryKey: ["services", memberId],
    queryFn: () => getMemberServices({ memberId }),
    enabled: !!memberId,
  });

  const services = data?.data;

  const filteredServices = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) return services ?? [];

    return (services ?? []).filter((service) =>
      service.name.toLowerCase().includes(search),
    );
  }, [services, query]);

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
            Select a service
          </h1>
          <SearchBar
            size="lg"
            placeholder="Search by service name"
            value={query}
            onChange={setQuery}
            className="my-4 mx-1"
          ></SearchBar>
          <ScrollArea className="flex-1 min-h-0 pr-2">
            <div className="flex flex-col gap-1  ">
              {isLoading ? (
                <p>Is Loading...</p>
              ) : (
                filteredServices.map((service) => {
                  return (
                    <Button
                      variant="ghost"
                      className="flex justify-start p-2 h-fit "
                      key={service.id}
                      onClick={() => {
                        setSelectedServices((prev) => [...prev, service]);
                        onOpenChange(false);
                      }}
                    >
                      <div className="h-20 w-1 bg-primary/50 rounded-2xl"></div>

                      <div className="flex py-2 px-2 bg-red w-full justify-between ">
                        <div className="flex flex-col items-start">
                          <p className="text-base">{service.name}</p>
                          <p className="text-muted-foreground">
                            {formatDurationMin(service.durationMin)}
                          </p>
                        </div>
                        <p className="text-base">Ron {service.price}</p>
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
