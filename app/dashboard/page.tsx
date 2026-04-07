import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import data from "./data.json";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TopClientesRisco } from "./_components/client-list-top-risc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ClientRiscGrafic from "./_components/client-risc-garfic";

export default function Dashboard() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <TooltipProvider>
        <AppSidebar />
      </TooltipProvider>
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Clientes em risco</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ClientRiscGrafic />
                  </CardContent>
                </Card>
              </div>
              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top 10 clientes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TopClientesRisco />
                  </CardContent>
                </Card>
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
