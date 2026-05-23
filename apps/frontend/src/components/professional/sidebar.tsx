"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  ArrowRight02Icon,
  Calendar01Icon,
  Calendar03Icon,
  Calendar04Icon,
  DashboardSquareEditIcon,
  Home01Icon,
  Settings01Icon,
  SmileIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home01Icon,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar04Icon,
  },
  {
    title: "Clients",
    url: "/clients",
    icon: SmileIcon,
  },
  {
    title: "Team",
    url: "/team",
    icon: UserGroupIcon,
  },
  {
    title: "Services",
    url: "/servicies",
    icon: DashboardSquareEditIcon,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings01Icon,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroupContent>
          <SidebarMenu className="flex justify-center items-center gap-2">
            {items.map((item, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton
                  isActive={pathname.includes(item.url)}
                  tooltip={{
                    children: item.title,
                    hidden: false,
                    className: "text-[14px] font-mediu py-2 px-3 ",
                    side: "right",
                    sideOffset: 24,
                  }}
                  render={<Link href={`/professional${item.url}`} />}
                  className="size-11 flex items-center justify-center relative  data-active:bg-primary data-active:text-primary-foreground hover:shadow-[inset_0_0_0_100px_rgba(0,0,0,0.08  )]"
                >
                  <HugeiconsIcon className="[svg]:size-7" icon={item.icon} />
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
