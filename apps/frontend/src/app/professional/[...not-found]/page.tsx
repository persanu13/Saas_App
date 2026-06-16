import { redirect } from "next/navigation";

export default function CatchAll() {
  redirect("/professional/calendar");
}
