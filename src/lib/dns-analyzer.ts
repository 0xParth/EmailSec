import { promises as dns } from 'dns';
import type { RecordAnalysis, RecordStatus } from '@/lib/types';

function determineStatus(findings: RecordAnalysis['findings']): RecordStatus {
    if (findings.some(f => f.type === 'error' || f.type === 'invalid')) return 'invalid';
    if (findings.some(f => f.type === 'warning')) return 'warning';
    if (findings.length > 0) return 'valid';
    return 'info';
}

export async function analyzeSpf(domain: string): Promise<RecordAnalysis> {
    const findings: RecordAnalysis['findings'] = [];
    let record: string | null = null;

    try {
        const txtRecords = (await dns.resolveTxt(domain)).flat();
        const spfRecords = txtRecords.filter(r => r.startsWith('v=spf1 '));

        if (spfRecords.length === 0) {
            findings.push({ type: 'error', message: 'No SPF record found.' });
        } else if (spfRecords.length > 1) {
            findings.push({ type: 'error', message: 'Multiple SPF records found. Only one is allowed.' });
            record = spfRecords.join('\n');
        } else {
            record = spfRecords[0];
            findings.push({ type: 'info', message: 'SPF record found.' });

            if (record.includes('all')) {
                if (record.includes('-all')) {
                    findings.push({ type: 'valid', message: 'SPF record has a "-all" (fail) mechanism, which is good practice.' });
                } else if (record.includes('~all')) {
                    findings.push({ type: 'warning', message: 'SPF record uses "~all" (softfail). Consider using "-all" for a stricter policy.' });
                } else if (record.includes('?all')) {
                    findings.push({ type: 'warning', message: 'SPF record uses "?all" (neutral). Consider using "-all" for a stricter policy.' });
                } else if (record.includes('+all')) {
                    findings.push({ type: 'error', message: 'SPF record uses "+all", which allows any server to send email from your domain. This is a major security risk.' });
                }
            } else {
                findings.push({ type: 'warning', message: 'SPF record does not have an "all" mechanism. It is recommended to end with one (e.g., "~all" or "-all").' });
            }
        }
    } catch (error: any) {
        if (error.code === 'ENOTFOUND' || error.code === 'ENODATA' || error.code === 'ESERVFAIL') {
            findings.push({ type: 'error', message: 'No TXT records found for the domain.' });
        } else {
            findings.push({ type: 'error', message: `DNS query failed: ${error.message}` });
        }
    }
    
    const status = determineStatus(findings);
    return { record, status, findings };
}


export async function analyzeDmarc(domain: string): Promise<RecordAnalysis> {
    const findings: RecordAnalysis['findings'] = [];
    let record: string | null = null;

    try {
        const txtRecords = (await dns.resolveTxt(`_dmarc.${domain}`)).flat();
        const dmarcRecords = txtRecords.filter(r => r.startsWith('v=DMARC1'));

        if (dmarcRecords.length === 0) {
            findings.push({ type: 'warning', message: 'No DMARC record found. It is highly recommended to have a DMARC policy.' });
        } else if (dmarcRecords.length > 1) {
            findings.push({ type: 'error', message: 'Multiple DMARC records found. Only one is allowed.' });
            record = dmarcRecords.join('\n');
        } else {
            record = dmarcRecords[0];
            findings.push({ type: 'info', message: 'DMARC record found.' });
            
            const policyMatch = record.match(/p=([^;]+)/);
            if (!policyMatch) {
                findings.push({ type: 'error', message: 'DMARC record is missing a policy (p= tag).' });
            } else {
                const policy = policyMatch[1].trim();
                if (policy === 'none') {
                    findings.push({ type: 'warning', message: 'DMARC policy is "none". This only monitors, it does not protect against spoofing. Consider "quarantine" or "reject".' });
                } else if (policy === 'quarantine') {
                    findings.push({ type: 'valid', message: 'DMARC policy is "quarantine".' });
                } else if (policy === 'reject') {
                    findings.push({ type: 'valid', message: 'DMARC policy is "reject", which provides the strongest protection.' });
                }
            }
            if (!record.includes('rua=')) {
                findings.push({ type: 'warning', message: 'DMARC record is missing an aggregate reporting address (rua= tag). Reporting is highly recommended.' });
            }
        }
    } catch (error: any) {
        if (error.code === 'ENOTFOUND' || error.code === 'ENODATA' || error.code === 'ESERVFAIL') {
            findings.push({ type: 'warning', message: 'No DMARC record found. It is highly recommended to have a DMARC policy.' });
        } else {
            findings.push({ type: 'error', message: `DNS query failed: ${error.message}` });
        }
    }
    
    const status = determineStatus(findings);
    return { record, status, findings };
}

export async function analyzeDkim(domain: string, selector: string): Promise<RecordAnalysis> {
    const findings: RecordAnalysis['findings'] = [];
    let record: string | null = null;
    const queryDomain = `${selector}._domainkey.${domain}`;

    try {
        const txtRecords = (await dns.resolveTxt(queryDomain)).flat();
        const dkimRecords = txtRecords.filter(r => r.startsWith('v=DKIM1'));

        if (dkimRecords.length === 0) {
            findings.push({ type: 'error', message: `No DKIM record found for selector "${selector}".` });
        } else {
            record = dkimRecords.join(' ');
            findings.push({ type: 'info', message: `DKIM record found for selector "${selector}".` });
            
            if (!record.includes('p=')) {
                findings.push({ type: 'error', message: 'DKIM record is missing the public key (p= tag).' });
            } else {
                findings.push({ type: 'valid', message: 'DKIM record seems to have a public key.' });
            }
        }
    } catch (error: any) {
        if (error.code === 'ENOTFOUND' || error.code === 'ENODATA' || error.code === 'ESERVFAIL') {
            findings.push({ type: 'error', message: `No DKIM record found for selector "${selector}" at ${queryDomain}.` });
        } else {
            findings.push({ type: 'error', message: `DNS query for DKIM failed: ${error.message}` });
        }
    }
    
    const status = determineStatus(findings);
    return { record, status, findings };
}
