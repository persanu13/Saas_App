"use client";

import {
  getOrganizationClients,
  getOrganizationMembers,
} from "@/api/organizations";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddMember } from "@/components/professional/team/add-member";
import { DataTable } from "@/components/professional/clients/clients-data-table";
import { clientsColumns } from "@/components/professional/clients/clients-columns";

export default function ClientsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["organization_clients"],
    queryFn: getOrganizationClients,
  });
  const clients = data?.data ?? [];

  return (
    <div className="flex justify-center mt-8 w-full">
      <Card className="ring-0 w-full max-w-6xl">
        <CardHeader>
          <CardTitle className="text-2xl items-center flex gap-2 font-bold">
            Clients list
            <span className="rounded-full border py-1 px-3 text-[12px] font-mediu">
              {clients.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 my-8">
            {isLoading ? (
              <p>Is Loading...</p>
            ) : (
              <DataTable columns={clientsColumns} data={clients} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
