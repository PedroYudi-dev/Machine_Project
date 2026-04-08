"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { getTopClients } from "../action/get-top-clients";

type BarData = {
  label: string;
  value: number;
};

export function TopClientesRisco() {
  const [data, setData] = useState<BarData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTopClients();
        const res = response.data;
        setData(res.map((item: any)=>({
          label: item.customerID,
          value: item.probabilidade_churn
        })));
      } catch (error) {
        console.error("Error fetching top clients data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="h-[360px] w-[900px] max-w-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 60, left: 20, bottom: 5 }}
        >
          <XAxis
            type="number"
            domain={[0, 1]}
            tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
          />
          <YAxis type="category" dataKey="label" width={120} />
          <Bar
            dataKey="value"
            fill="#e74c3c"
            radius={[0, 4, 4, 0]}
            isAnimationActive={true}
          >
            <LabelList
              dataKey="value"
              position="right"
              formatter={(v) =>
                typeof v === "number" ? `${(v * 100).toFixed(0)}%` : v
              }
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
