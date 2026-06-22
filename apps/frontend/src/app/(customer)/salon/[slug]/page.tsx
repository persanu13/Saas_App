"use client";

import { getBySlug } from "@/api/organizations";
import { Service } from "@/api/services";
import { useAuthStore } from "@/common/stores/auth.store";
import { MakeApoinment } from "@/components/customer/make-appoinment";
import { MemberAvatar } from "@/components/customer/member-avatar";
import { ServiceCard } from "@/components/customer/service-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useQuery } from "@tanstack/react-query";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useLogout } from "@/common/hooks/use-logout";

export default function SalonPage() {
  const { user } = useAuthStore();
  const { mutate: logout, isPending } = useLogout();
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);

  const params = useParams();
  const slug = params.slug as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ["organization", slug],
    queryFn: () => getBySlug(slug),
    enabled: !!slug,
    retry: false, // important
  });

  const organization = data?.data;
  const services = organization?.services ?? [];
  const members = organization?.members ?? [];
  const hasMoreThan10 = services.length > 8;

  useEffect(() => {
    if (error && (error as any)?.statusCode === 404) {
      notFound();
    }
  }, [error]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <main className="pb-50 w-full   pt-16 px-8">
      <div className="flex flex-col w-full mt-3 max-w-360 m-auto">
        {organization && user?.type === "CUSTOMER" ? (
          <MakeApoinment
            open={open}
            onOpenChange={setOpen}
            organization={organization}
            setSelectedServices={setSelectedServices}
            selectedServices={selectedServices}
          ></MakeApoinment>
        ) : (
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sign in required</AlertDialogTitle>
                <AlertDialogDescription>
                  You need to be signed in to book an appointment. Would you
                  like to go to the login page now?
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Not now</AlertDialogCancel>

                <AlertDialogAction
                  onClick={() => {
                    if (user && user?.type !== "CUSTOMER") {
                      logout();
                    }
                    router.push(`/auth/customer/login`);
                    Cookies.set("post_auth_redirect", `/salon/${slug}`, {
                      expires: 1,
                    });
                  }}
                  disabled={isPending}
                >
                  Go to login
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        <h1 className="text-5xl font-black">{organization?.name}</h1>
        <div className="flex mt-10 gap-10 relative">
          <div className="flex flex-col flex-1 gap-20">
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl font-bold">Services</h3>

              {services.length > 0 ? (
                <>
                  <div className="grid grid-cols-1  gap-4 ">
                    {services.slice(0, 10).map((service) => (
                      <ServiceCard
                        onClick={(service) => {
                          setSelectedServices([service]);
                          setOpen(true);
                        }}
                        key={service.id}
                        service={service}
                      />
                    ))}
                  </div>

                  {hasMoreThan10 && (
                    <Button
                      size="custom-desktop"
                      variant="outline"
                      className="w-fit"
                    >
                      See all services
                    </Button>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground mt-4">
                  No services available yet.
                </p>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl font-bold">Team</h3>
              <div className="grid grid-cols-4 w-full gap-4">
                {members.map((member) => (
                  <MemberAvatar key={member.id} member={member} />
                ))}
              </div>
            </div>
          </div>

          <Card className="mx-auto w-full max-w-sm px-4 py-8 h-fit sticky top-30">
            <CardHeader>
              <CardTitle className="text-4xl font-black mb-1">
                {organization?.name}
              </CardTitle>
              <CardDescription className="font-medium ">
                Take your time and make your much-desired salon appointment.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-6">
              <Button
                size="custom-desktop"
                className="w-full"
                onClick={() => setOpen(true)}
              >
                Book now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
