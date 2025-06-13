// src\components\ui\BarChart.tsx
'use client';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type BarChartProps = {
  data: { adId: string; impressions: number; clicks: number; spend: number }[];
  metric: 'spend' | 'clicks';
};

export function BarChart({ data, metric }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReBarChart data={data}>
        <XAxis dataKey="adId" />
        <YAxis />
        <Tooltip />
        <Bar dataKey={metric} fill="#3b82f6" />
      </ReBarChart>
    </ResponsiveContainer>
  );
}
