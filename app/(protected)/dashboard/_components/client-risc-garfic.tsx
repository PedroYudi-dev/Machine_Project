'use client'
import { useEffect, useState } from 'react';
import { Pie, PieChart, PieLabelRenderProps, PieSectorShapeProps, Legend , ResponsiveContainer, Sector } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import { getResumeDashBoardRisc } from '../action/get-grafic';
import { PieData } from '@/types/pie-data';


const RADIAN = Math.PI / 180;
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelRenderProps) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null;
  }
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const ncx = Number(cx);
  const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const ncy = Number(cy);
  const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > ncx ? 'start' : 'end'} dominantBaseline="central">
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

const MyCustomPie = (props: PieSectorShapeProps) => {
  return <Sector {...props} fill={COLORS[props.index % COLORS.length]} />;
};

export default function ClientRiscGrafic({ isAnimationActive = true }: { isAnimationActive?: boolean }) {
  const [data, setData] = useState<PieData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getResumeDashBoardRisc();
        const res = response.data
        setData([
          {name: "Alto Risco", value: res.alto_risco},
          {name: "Baixo Risco", value: res.baixo_risco},
        ])
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="h-[360px] w-[900px] max-w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            labelLine={false}
            label={renderCustomizedLabel}
            fill="#8884d8"
            dataKey="value"
            isAnimationActive={isAnimationActive}
            shape={MyCustomPie}
          />
          <Legend/>
          <RechartsDevtools />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
