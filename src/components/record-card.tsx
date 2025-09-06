'use client';

import type { RecordAnalysis } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

interface RecordCardProps {
  title: string;
  data: RecordAnalysis;
  selector?: string;
}

const statusIcons = {
  valid: <CheckCircle2 className="h-5 w-5 text-green-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
  invalid: <XCircle className="h-5 w-5 text-destructive" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
};

const findingIcons: { [key: string]: React.ReactNode } = {
  valid: <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-1" />,
  warning: <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-1" />,
  error: <XCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-1" />,
  info: <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-1" />,
};

export function RecordCard({ title, data, selector }: RecordCardProps) {
  const cardTitle = selector ? `${title} (${selector})` : title;
  
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>{cardTitle}</CardTitle>
                <CardDescription className="capitalize pt-1">{data.status}</CardDescription>
            </div>
            {statusIcons[data.status]}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
        {data.record && (
          <div>
            <h4 className="font-semibold text-sm mb-1">Record Found</h4>
            <pre className="p-3 bg-muted rounded-md text-xs overflow-x-auto font-code">
              <code>{data.record}</code>
            </pre>
          </div>
        )}
        {data.findings.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2">Findings</h4>
            <ul className="space-y-2">
              {data.findings.map((finding, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  {findingIcons[finding.type === 'invalid' ? 'error' : finding.type]}
                  <span>{finding.message}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
