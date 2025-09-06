'use client';

import { useState, useTransition } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { analyzeDomain } from '@/app/actions';
import type { AnalysisResult } from '@/lib/types';
import { DomainForm } from '@/components/domain-form';
import { ResultsDashboard } from '@/components/results-dashboard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function Home() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = (data: { domain: string }) => {
    setError(null);
    setResult(null);
    startTransition(async () => {
      const response = await analyzeDomain(data.domain);
      if (response.error) {
        setError(response.error);
      } else {
        setResult(response.data);
      }
    });
  };

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col justify-center">
        <div className="container relative pb-10">
          <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center py-8 md:py-12 lg:py-24">
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl font-headline">
                Uncover Your Email Security Posture
              </h1>
              <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
                Enter your domain to analyze its SPF, DKIM, and DMARC configurations.
              </p>
            </div>
            <div className="w-full">
              <DomainForm onAnalyze={handleAnalysis} isPending={isPending} />
            </div>
          </section>

          <div className="mx-auto max-w-7xl">
            {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {isPending && (
              <div className="flex justify-center">
                <div className="flex flex-col items-center gap-4">
                  <svg
                    className="animate-spin h-8 w-8 text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <p className="text-muted-foreground">Analyzing domain...</p>
                </div>
              </div>
            )}

            {result && !isPending && (
              <section>
                <ResultsDashboard result={result} />
              </section>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
