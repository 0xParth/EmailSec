import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench } from 'lucide-react';

export function RemediationGuidance({ guidance }: { guidance: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="text-primary" />
          Remediation Steps
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm space-y-4 whitespace-pre-wrap font-body leading-relaxed text-foreground/90">
          {guidance}
        </div>
      </CardContent>
    </Card>
  );
}
