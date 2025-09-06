import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench } from 'lucide-react';
import type { RemediationStep } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function RemediationGuidance({ guidance }: { guidance: RemediationStep[] }) {
  if (!guidance || guidance.length === 0) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="text-primary" />
          Remediation Steps
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {guidance.map((step, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-base text-left hover:no-underline">
                {index + 1}. {step.title}
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-sm space-y-4 whitespace-pre-wrap font-body leading-relaxed text-foreground/80 pl-2 border-l-2 border-primary/50 ml-2">
                  {step.description}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
