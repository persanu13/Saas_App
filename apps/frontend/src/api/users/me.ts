import { api } from "@/lib/axios";
import { Member, Organization } from "../organizations";

export async function getMyOrganizations() {
  const path: string = `/users/me/organizations`;
  return api.get<{ organizations: Member[] }>(path);
}
