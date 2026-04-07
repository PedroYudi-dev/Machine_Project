import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex w-full">
        <TooltipProvider>
          <AppSidebar />
        </TooltipProvider>
        <SidebarTrigger />
        <main className="flex-1 ">
          <div className="w-full px-4 py-8">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
