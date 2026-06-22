import { api } from "@/lib/axios";
import { emailSchema, organizationSchema } from "@/lib/schemas/organizations";
import z from "zod";
import { Service } from "./services";
import { weeklyScheduleSchema } from "@/lib/schemas/members";

export type Organization = {
  id: number;
  name: string;
  slug: string;
  services: Service[];
  members: Member[];
};

export type Member = {
  id: number;
  role: "OWNER" | "MANAGER" | "STAFF";
  userId: number;
  organizationId: number;
  organization?: Organization;
  serviceIds: number[];
  name: string;
  email: string;
  phone?: string;
};

export type Client = {
  user: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
};

export type Day = {
  date: string;
  startMin: number[];
};

export async function createOrganization(
  formData: z.infer<typeof organizationSchema>,
) {
  const path: string = "/organizations";
  const data = {
    name: formData.name,
    slug: formData.slug ?? null,
  };
  return api.post<any>(path, data);
}

export async function getOrganizationMembers() {
  const path: string = `/organizations/all-members`;
  return api.get<Member[]>(path);
}

export async function getOrganizationClients() {
  const path: string = `/organizations/clients`;
  return api.get<Client[]>(path);
}

export async function getOrganizationServices() {
  const path: string = `/organizations/services`;
  return api.get<Service[]>(path);
}

export async function addSchedule(
  formData: z.output<typeof weeklyScheduleSchema> & {
    memberId: number;
  },
) {
  const slots = Object.entries(formData.days).flatMap(([day, daySlots]) =>
    daySlots.map((slot) => ({
      day,
      startMin: slot.startMin,
      endMin: slot.endMin,
    })),
  );
  const data = {
    memberId: formData.memberId,
    validFrom: formData.validFrom.toLocaleDateString("en-CA"),
    validUntil: formData.validUntil
      ? formData.validUntil.toLocaleDateString("en-CA")
      : null,
    slots: slots,
  };
  console.log(data);
  const path: string = `/schedule`;
  return api.post<any>(path, data);
}

export async function sendInvitation(formData: z.infer<typeof emailSchema>) {
  const data = {
    email: formData.email,
  };
  const path: string = `/organizations/send-invitation`;
  return api.post<any>(path, data);
}

export async function acceptInvitation(token: string | null) {
  if (!token) throw "Token dont exist";
  const path: string = `/organizations/accept-invitation`;
  console.log(token);
  const data = {
    token,
  };
  return api.post<any>(path, data);
}

export async function getBySlug(slug: string) {
  const path: string = `/organizations/${slug}`;
  return api.get<Organization>(path);
}

export async function getAllWithSlug() {
  const path: string = `/organizations/all-with-slug`;
  return api.get<Organization[]>(path);
}

export async function getAvailability(selectedServices: Service[]) {
  const path: string = `/organizations/availability`;
  const services = selectedServices.map((s) => {
    return {
      serviceId: s.id,
      memberId: s.selectedProfessionalId,
    };
  });
  const data = { services };
  return api.post<Day[]>(path, data);
}

export async function getLastOrganization() {
  const path = "/organizations/last-organization";
  return api.get<Organization>(path);
}
