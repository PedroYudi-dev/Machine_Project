
import { DataTable } from "@/components/data-table";
import { SiteHeader } from "@/components/site-header";

import data from "./data.json";
import { TopClientesRisco } from "./_components/client-list-top-risc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ClientRiscGrafic from "./_components/client-risc-garfic";

export default function Dashboard() {
  return (
    <>
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
    </>
  );
}
