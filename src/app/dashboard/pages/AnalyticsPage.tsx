'use client';

import React, { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Types

type ChartPoint = { name: string; value: number } | null;
type ChartType = 'line' | 'bar';
type MetricKey = 'value';

// Dummy Data

const dummyData = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 200 },
  { name: 'Thu', value: 278 },
  { name: 'Fri', value: 189 },
];

const dummyTableRows = [
  { metric: 'Impressions', organic: 1200, paid: 3500 },
  { metric: 'Clicks', organic: 150, paid: 700 },
  { metric: 'Conversions', organic: 8, paid: 42 },
  { metric: 'CTR (%)', organic: 12.5, paid: 20 },
  { metric: 'Conversion Rate (%)', organic: 5.3, paid: 6 },
  { metric: 'Cost per Click ($)', organic: 0, paid: 1.25 },
  { metric: 'CPM ($)', organic: 0, paid: 5.5 },
];

const audienceInsights = [
  { label: 'Top Location', value: 'New York, USA' },
  { label: 'Age Range', value: '25-34' },
  { label: 'Gender Split', value: '60% Male / 40% Female' },
  { label: 'Device Type', value: '70% Mobile / 30% Desktop' },
  { label: 'Top Interests', value: 'Marketing, Tech, SaaS' },
];

const funnelSummary = [
  { label: 'Sessions', value: 8000 },
  { label: 'Leads', value: 500 },
  { label: 'MQLs', value: 120 },
  { label: 'SQLs', value: 45 },
  { label: 'Deals', value: 20 },
  { label: 'Revenue ($)', value: 8500 },
];

const platforms = ['overview', 'facebook', 'instagram', 'tiktok', 'youtube', 'linkedin'] as const;
const chartTypes = ['line', 'bar'] as const;
const metrics = ['value'] as const;

// Component

const AnalyticsPage = () => {
  const [hoveredPoint, setHoveredPoint] = useState<ChartPoint>(null);
  const [chartType, setChartType] = useState<ChartType>('line');
  const [metric, setMetric] = useState<MetricKey>('value');

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
        <div className="flex gap-3">
          <Select onValueChange={(v) => setChartType(v as ChartType)} defaultValue={chartType}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Chart" />
            </SelectTrigger>
            <SelectContent>
              {chartTypes.map((type) => (
                <SelectItem key={type} value={type}>{type.toUpperCase()}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(v) => setMetric(v as MetricKey)} defaultValue={metric}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="value">Default</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-6 w-full bg-muted p-1 rounded-xl">
          {platforms.map((platform) => (
            <TabsTrigger key={platform} value={platform} className="capitalize">
              {platform}
            </TabsTrigger>
          ))}
        </TabsList>

        {platforms.map((platform) => (
          <TabsContent key={platform} value={platform} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{platform} Performance</CardTitle>
                <CardDescription>Hover to inspect metrics.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  {chartType === 'line' ? (
                    <LineChart
                      data={dummyData}
                      onMouseMove={(e) => setHoveredPoint(e?.activePayload?.[0]?.payload || null)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    >
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey={metric} stroke="#2563eb" strokeWidth={2} dot={false} />
                    </LineChart>
                  ) : (
                    <BarChart
                      data={dummyData}
                      onMouseMove={(e) => setHoveredPoint(e?.activePayload?.[0]?.payload || null)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    >
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey={metric} fill="#2563eb" />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {hoveredPoint && (
              <Card>
                <CardHeader>
                  <CardTitle>Hovered Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    You hovered on <b>{hoveredPoint.name}</b> with value: <b>{hoveredPoint[metric]}</b>
                  </p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead>Organic</TableHead>
                      <TableHead>Paid</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dummyTableRows.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{row.metric}</TableCell>
                        <TableCell>{row.organic}</TableCell>
                        <TableCell>{row.paid}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audience Insights</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                {audienceInsights.map((item, idx) => (
                  <div key={idx} className="text-sm">
                    <p className="text-muted-foreground">{item.label}</p>
                    <p className="font-medium">{item.value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Funnel Summary</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {funnelSummary.map((item, idx) => (
                  <div key={idx} className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="text-lg font-semibold">{item.value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
