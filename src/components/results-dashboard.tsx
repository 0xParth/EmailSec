'use client';

import type { AnalysisResult } from '@/lib/types';
import { RecordCard } from './record-card';
import { RemediationGuidance } from './remediation-guidance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';

export function ResultsDashboard({ result }: { result: AnalysisResult }) {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      <h2 className="text-2xl font-bold font-headline text-center">
        Analysis for <span className="text-primary">{result.domain}</span>
      </h2>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <RecordCard title="SPF" data={result.spf} />
        <RecordCard title="DKIM" data={result.dkim} selector={result.dkimSelector} />
        <RecordCard title="DMARC" data={result.dmarc} />
      </div>

      {result.vulnerabilities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert />
              Potential Vulnerabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-sm">
              {result.vulnerabilities.map((vuln, i) => (
                <li key={i}>{vuln}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <RemediationGuidance guidance={result.remediationGuidance} />
    </div>
  );
}
