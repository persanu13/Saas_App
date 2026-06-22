"use client";
import { getOrganizationServices } from "@/api/organizations";
import { Service } from "@/api/services";
import { SearchBar } from "@/components/my-ui/search-bar";
import { ServiceCard } from "@/components/professional/services/service-card";
import { ServiceDetail } from "@/components/professional/services/service-detail";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MoreVerticalSquare01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export default function ServiciesPage() {
  const [query, setQuery] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["organization_services"],
    queryFn: getOrganizationServices,
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
    <div className="flex justify-center mt-8 w-full">
      <ServiceDetail
        open={open}
        onOpenChange={(value) => {
          setOpen(value);
          if (!value) {
            setTimeout(() => {
              setSelectedService(null);
            }, 300);
          }
        }}
        service={selectedService}
      />
      <Card className="ring-0 w-full max-w-6xl">
        <CardHeader>
          <CardTitle className="text-2xl items-center flex gap-2 font-bold">
            Services Menu
          </CardTitle>
          <CardDescription className="font-medium">
            View and manage the services offered by your business.
          </CardDescription>
          <CardAction>
            <Button
              size="custom-desktop"
              onClick={() => {
                setOpen(true);
              }}
            >
              Add Service
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="flex bg-accent/50 p-4 rounded-lg">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Search service name"
              className="bg-background"
            ></SearchBar>
          </div>
          <div className="flex flex-col gap-3 my-8">
            {isLoading ? (
              <p>Is Loading...</p>
            ) : (
              filteredServices.map((service) => {
                return (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onEdit={() => {
                      setSelectedService(service);
                      setOpen(true);
                    }}
                  />
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
