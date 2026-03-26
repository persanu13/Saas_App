import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <Button
        nativeButton={false}
        variant="link"
        render={<Link href="/auth" />}
      >
        Login
      </Button>
    </div>
  );
}
