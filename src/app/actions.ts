'use server';

import { analyzeSpf, analyzeDkim, analyzeDmarc } from '@/lib/dns-analyzer';
import { detectVulnerabilities } from '@/ai/flows/vulnerability-detection';
import { generateRemediationGuidance } from '@/ai/flows/plain-english-remediation';
import type { AnalysisResult } from '@/lib/types';

export async function analyzeDomain(
  domain: string,
  dkimSelector: string
): Promise<{ data: AnalysisResult | null; error: string | null }> {
  try {
    if (!domain || !dkimSelector) {
        return { data: null, error: 'Domain and DKIM selector are required.' };
    }

    const [spf, dkim, dmarc] = await Promise.all([
      analyzeSpf(domain),
      analyzeDkim(domain, dkimSelector),
      analyzeDmarc(domain),
    ]);
    
    const aiVulnerabilities = await detectVulnerabilities({
        spfRecord: spf.record,
        dkimRecord: dkim.record,
        dmarcRecord: dmarc.record,
    });
    
    const allFindings = [
        ...spf.findings.map(f => `SPF: ${f.message}`),
        ...dkim.findings.map(f => `DKIM: ${f.message}`),
        ...dmarc.findings.map(f => `DMARC: ${f.message}`),
    ];
    
    const vulnerabilityReport = `
      Domain: ${domain}
      
      SPF Record: ${spf.record || 'Not found'}
      DKIM Record (${dkimSelector}): ${dkim.record || 'Not found'}
      DMARC Record: ${dmarc.record || 'Not found'}
      
      Summary of findings:
      ${allFindings.join('\n')}
      
      Additional vulnerabilities detected by AI: ${aiVulnerabilities.vulnerabilities.join(', ') || 'None'}
    `;

    const remediation = await generateRemediationGuidance({ vulnerabilityReport });

    const result: AnalysisResult = {
      domain,
      dkimSelector,
      spf,
      dkim,
      dmarc,
      vulnerabilities: aiVulnerabilities.vulnerabilities,
      remediationGuidance: remediation.remediationGuidance,
    };

    return { data: result, error: null };
  } catch (err: any) {
    console.error('Analysis failed:', err);
    return { data: null, error: err.message || 'An unknown error occurred during analysis.' };
  }
}
