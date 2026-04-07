"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const data = [
  { label: "7590-VHVEG", value: 0.85 },
  { label: "5575-GNVDE", value: 0.78 },
  { label: "3668-QPYBK", value: 0.72 },
  { label: "7795-CFOCW", value: 0.65 },
  { label: "9237-HQITU", value: 0.61 },
];

export function TopClientesRisco() {
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
