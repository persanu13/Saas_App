import { LinkCard } from "@/components/my-ui/link-card";
import { Fragment } from "react/jsx-runtime";

const LINKS = [
  {
    title: "Trimly for customers",
    description: "Book salons and spas near you",
    href: "/auth/customer",
  },
  {
    title: "Trimly for professionals",
    description: "Manage and grow your business",
    href: "/auth/professional",
  },
];

export default function AuthPage() {
  return (
    <Fragment>
      <h1 className="text-center text-2xl font-semibold  tracking-tighter ">
        Sign up/log in
      </h1>
      <div className="flex flex-col gap-4 w-full">
        {LINKS.map((link) => {
          return (
            <LinkCard
              key={link.href}
              href={link.href}
              title={link.title}
              description={link.description}
            ></LinkCard>
          );
        })}
      </div>
    </Fragment>
  );
}
