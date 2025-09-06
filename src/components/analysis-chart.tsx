'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { AnalysisResult } from '@/lib/types';
import { Badge } from './ui/badge';

interface AnalysisChartProps {
  result: AnalysisResult;
}

const chartConfig = {
  valid: { label: 'Valid', color: 'hsl(var(--chart-1))' },
  warning: { label: 'Warnings', color: 'hsl(var(--chart-2))' },
  error: { label: 'Errors', color: 'hsl(var(--chart-3))' },
} satisfies ChartConfig;

export function AnalysisChart({ result }: AnalysisChartProps) {
  const chartData = [
    {
      record: 'SPF',
      ...countFindings(result.spf.findings),
    },
    {
      record: 'DKIM',
      ...countFindings(result.dkim.findings),
    },
    {
      record: 'DMARC',
      ...countFindings(result.dmarc.findings),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Findings Summary</CardTitle>
        <CardDescription>A summary of the findings from the analysis.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="record"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
             <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="valid" fill="var(--color-valid)" radius={4} />
            <Bar dataKey="warning" fill="var(--color-warning)" radius={4} />
            <Bar dataKey="error" fill="var(--color-error)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function countFindings(
  findings: AnalysisResult['spf']['findings']
): Record<keyof typeof chartConfig, number> {
  let valid = 0;
  let warning = 0;
  let error = 0;

  for (const finding of findings) {
    if (finding.type === 'valid' || finding.type === 'info') valid++;
    if (finding.type === 'warning') warning++;
    if (finding.type === 'error' || finding.type === 'invalid') error++;
  }

  return { valid, warning, error };
}
