import { api } from "@/lib/axios";
import { DayOfWeek } from "react-day-picker";
import { Service } from "./services";

export type Slots = {
  id: number;
  scheduleId: number;
  day: DayOfWeek;
  startMin: number;
  endMin: number;
  date: Date;
};

export type User = {
  id: number;
  name: string;
  email: string;
  image: string | null;
  phone?: string | null;
};

export type Appointment = {
  id: number;

  memberId: number;
  bookedById: number;
  clientId: number | null;

  clientName: string | null;
  clientPhone: string | null;

  date: string;
  startMin: number;
  endMin: number;

  notes: string | null;

  client: User;
  bookedBy: User;
  services: { service: Service }[];
};

export type Calendar = {
  slots: Slots[];
  appoinments: Appointment[];
};

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
  return api.get<Calendar>(path);
}
