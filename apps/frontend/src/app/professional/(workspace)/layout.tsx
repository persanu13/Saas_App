import { AppSidebar } from "@/components/professional/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      className="min-h-[calc(100svh-64px)] "
      style={
        {
          "--sidebar-width": "4.2rem",
          "--sidebar-width-mobile": "4rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <main className="flex flex-col w-full flex-1">{children}</main>
    </SidebarProvider>
  );
}
