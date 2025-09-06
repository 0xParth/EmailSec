// src/ai/flows/plain-english-remediation.ts
'use server';

/**
 * @fileOverview This flow provides step-by-step guidance for fixing detected vulnerabilities in plain English.
 *
 * - generateRemediationGuidance - A function that generates remediation guidance based on vulnerability reports.
 * - RemediationInput - The input type for the generateRemediationGuidance function.
 * - RemediationOutput - The return type for the generateRemediationGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RemediationInputSchema = z.object({
  vulnerabilityReport: z
    .string()
    .describe(
      'A detailed report of the identified vulnerabilities in the email domain security configuration.'
    ),
});
export type RemediationInput = z.infer<typeof RemediationInputSchema>;

const RemediationOutputSchema = z.object({
  remediationGuidance: z
    .string()
    .describe(
      'Step-by-step guidance in plain English for fixing the detected vulnerabilities.'
    ),
});
export type RemediationOutput = z.infer<typeof RemediationOutputSchema>;

export async function generateRemediationGuidance(
  input: RemediationInput
): Promise<RemediationOutput> {
  return remediationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'remediationPrompt',
  input: {schema: RemediationInputSchema},
  output: {schema: RemediationOutputSchema},
  prompt: `You are an expert email security consultant. Your task is to provide clear and actionable step-by-step guidance for fixing the vulnerabilities identified in the provided report.

Vulnerability Report:
{{{vulnerabilityReport}}}

Provide remediation steps in plain English that are easy to understand for both technical and non-technical users. Do not use any markdown formatting (e.g., no asterisks for bolding). The output should be clean text.`,
});

const remediationFlow = ai.defineFlow(
  {
    name: 'remediationFlow',
    inputSchema: RemediationInputSchema,
    outputSchema: RemediationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
