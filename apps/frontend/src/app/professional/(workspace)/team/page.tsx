"use client";

import { getOrganizationMembers } from "@/api/organizations";
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
import { DataTable } from "@/components/professional/team/team-data-table";
import { teamColumns } from "@/components/professional/team/team-columns";
import { AddMember } from "@/components/professional/team/add-member";

export default function TeamPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["organization_members"],
    queryFn: getOrganizationMembers,
  });
  const members = data?.data ?? [];
  return (
    <div className="flex justify-center mt-8 w-full">
      <Card className="ring-0 w-full max-w-6xl">
        <CardHeader>
          <CardTitle className="text-2xl items-center flex gap-2 font-bold">
            Team members{" "}
            <span className="rounded-full border py-1 px-3 text-[12px] font-mediu">
              {members.length}
            </span>
          </CardTitle>

          <CardAction>
            <AddMember />
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 my-8">
            {isLoading ? (
              <p>Is Loading...</p>
            ) : (
              <DataTable columns={teamColumns} data={members} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
