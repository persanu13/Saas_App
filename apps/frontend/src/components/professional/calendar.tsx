"use client";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { DatePicker } from "../my-ui/date-picker";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect } from "react";

function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function Calendar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const date = searchParams.get("date");
  const today = toDateString(new Date());

  const setDate = (newDate: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", newDate);
    router.replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (!date) {
      setDate(today);
    }
  }, [date, router, pathname, searchParams]);

  return (
    <Fragment>
      <Button variant="outline" onClick={() => setDate(today)}>
        Today
      </Button>
      <ButtonGroup>
        <Button
          onClick={() => {
            if (!date) return;
            const d = new Date(date);
            d.setDate(d.getDate() - 1);
            setDate(toDateString(d));
          }}
          variant="outline"
        >
          <HugeiconsIcon className="[svg]:size-4" icon={ArrowLeft01Icon} />
        </Button>
        <DatePicker
          value={date ? fromDateString(date) : new Date()}
          onChange={(selectedDate) => {
            setDate(toDateString(selectedDate));
          }}
        />
        <Button
          variant="outline"
          onClick={() => {
            if (!date) return;
            const d = new Date(date);
            d.setDate(d.getDate() + 1);
            setDate(toDateString(d));
          }}
        >
          <HugeiconsIcon className="[svg]:size-4" icon={ArrowRight01Icon} />
        </Button>
      </ButtonGroup>
    </Fragment>
  );
}
