import { api } from "@/lib/axios";
import { Service } from "./services";
import { DayAndTime } from "@/components/customer/make-appoinment";

export async function bookApoinment({
  selectedServices,
  dateTime,
  clientId,
}: {
  clientId?: number;
  selectedServices: Service[];
  dateTime: DayAndTime;
}) {
  const path: string = `/appointments/book`;
  const services = selectedServices.map((s) => {
    return {
      serviceId: s.id,
      memberId: s.selectedProfessionalId,
    };
  });
  const data = { clientId, services, dateTime };
  return api.post<any>(path, data);
}

export async function createApoinment({
  memberId,
  date,
  selectedServices,
  startMin,
  clientId,
}: {
  memberId: number;
  date: string;
  selectedServices: Service[];
  startMin: number;
  clientId?: number;
}) {
  const path: string = `/appointments`;
  const serviceIds = selectedServices.map((s) => s.id);
  const data = { clientId, serviceIds, memberId, date, startMin };
  return api.post<any>(path, data);
}

export async function deleteApoinment({
  appoinmentId,
}: {
  appoinmentId: number;
}) {
  const path: string = `/appointments/${appoinmentId}`;
  return api.delete<any>(path);
}
