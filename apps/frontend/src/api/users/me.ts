import { api } from "@/lib/axios";

export async function getMyOrganizations() {
  const path: string = `/users/me/organizations`;
  return api.get<{ organizations: any[] }>(path);
}
