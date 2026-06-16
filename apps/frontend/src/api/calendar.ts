import { api } from "@/lib/axios";

export async function getCalendar({
  date,
  view,
  memberId,
}: {
  date: string | null;
  view: string | null;
  memberId: string | null;
}) {
  const params = new URLSearchParams();
  if (date) params.set("date", date);
  if (view) params.set("view", view.toUpperCase());
  if (memberId) params.set("memberId", memberId);

  const path: string = `/schedule/calendar?${params.toString()}`;
  return api.get<any>(path);
}
