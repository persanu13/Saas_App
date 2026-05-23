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
      style={
        {
          "--sidebar-width": "4.2rem",
          "--sidebar-width-mobile": "4rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />

      <main className="flex flex-col  h-screen w-full">{children}</main>
    </SidebarProvider>
  );
}
