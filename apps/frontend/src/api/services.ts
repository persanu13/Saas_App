import { api } from "@/lib/axios";
import { serviceSchema } from "@/lib/schemas/services";
import z from "zod";
import { Member } from "./organizations";

export type Service = {
  id: number;
  organizationId: number;
  name: string;
  description: string | null;
  durationMin: number;
  price: number;
  members: Member[];
  selectedProfessionalId: number | null;
};

export async function getMemberServices({
  memberId,
}: {
  memberId: string | null;
}) {
  const params = new URLSearchParams();
  if (memberId) params.set("memberId", memberId);

  const path: string = `/services/member-services?${params.toString()}`;
  return api.get<Service[]>(path);
}

export async function addService(formData: z.output<typeof serviceSchema>) {
  const path: string = "/services";
  const data = {
    name: formData.name,
    description: formData.description,
    durationMin: formData.durationMin,
    price: formData.price,
    memberIds: formData.memberIds,
  };
  return api.post<any>(path, data);
}

export async function editService(
  id: number,
  formData: z.output<typeof serviceSchema>,
) {
  const path: string = `/services/${id}`;

  const data = {
    name: formData.name,
    description: formData.description,
    durationMin: formData.durationMin,
    price: formData.price,
    memberIds: formData.memberIds,
  };
  return api.patch<any>(path, data);
}

export async function deleteService(id: number) {
  const path: string = `/services/${id}`;
  return api.delete<any>(path);
}
