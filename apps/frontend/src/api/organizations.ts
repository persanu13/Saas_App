import { api } from "@/lib/axios";
import { organizationSchema } from "@/lib/schemas/organizations";
import z from "zod";

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
  return api.get<any>(path);
}
