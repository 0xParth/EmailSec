export type RecordStatus = 'valid' | 'invalid' | 'warning' | 'info';

export type RecordAnalysis = {
  record: string | null;
  status: RecordStatus;
  findings: {
    type: RecordStatus | 'error';
    message: string;
  }[];
};

export type RemediationStep = {
  title: string;
  description: string;
};

export type AnalysisResult = {
  domain: string;
  dkimSelector: string;
  spf: RecordAnalysis;
  dkim: RecordAnalysis;
  dmarc: RecordAnalysis;
  vulnerabilities: string[];
  remediationGuidance: RemediationStep[];
};
