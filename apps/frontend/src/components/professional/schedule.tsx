import { getCalendar } from "@/api/calendar";
import { Button } from "../ui/button";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export function Schedule() {
  const hours = Array.from(
    { length: 24 },
    (_, i) => String(i).padStart(2, "0") + ":00",
  );

  const slots = Array.from({ length: 24 * 4 }, (_, i) => {
    const totalMin = i * 15;
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  });

  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const view = searchParams.get("view");
  const memberId = searchParams.get("member_id");

  const { data, isLoading, error } = useQuery({
    queryKey: ["calendar", date, view, memberId],
    queryFn: () => getCalendar({ date, view, memberId }),
    enabled: !!date && !!view && !!memberId,
  });

  if (isLoading) return <p>Is Loading...</p>;

  console.log(data);

  return (
    <div className="flex-1 overflow-y-auto min-h-0  ">
      <div className="flex h-540">
        <div className="h-full  px-1.5">
          {hours.map((hour, index) => {
            return (
              <div key={index} className="h-22.5">
                <p className="pt-[2px] font-medium text-[13px]">{hour}</p>
              </div>
            );
          })}
        </div>
        <div className="h-full flex-1 [&>*:nth-child(4n+1)]:border-t-border ">
          {slots.map((slot, index) => {
            return (
              <div
                key={index}
                className="h-[22.5px] border-x border-t border-t-border/40 flex items-center justify-center group p-px bg-muted bg-[repeating-linear-gradient(45deg,var(--color-border)_0px,var(--color-border)_0.6px,transparent_0.5px,transparent_6px)]"
              >
                <Button className="w-full h-full   bg-[color-mix(in_srgb,var(--primary)_10%,var(--background))] border-border rounded-[4px] opacity-0 group-hover:opacity-100 transition-opacity ">
                  <span className="text-start w-full text-[13px] font-normal text-primary">
                    {slot}
                  </span>
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
