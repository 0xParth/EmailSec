# **App Name**: MailSec Sherlock

## Core Features:

- Domain Input: Allow users to input their domain name to check email security configurations.
- DNS Record Analysis: Automatically retrieve and analyze DNS records (SPF, DKIM, DMARC) for the given domain. Report results of SPF, DKIM and DMARC policies. 
- Configuration Validity Check: Determine if the DNS records are correctly configured according to email security best practices. The validity check should have logic to determine the most common reasons why these technologies fail, and what vulnerabilities those failures may allow.
- Vulnerability Detection: Highlight potential email spoofing and other vulnerabilities based on the DNS configuration and identified risks.
- Plain English Remediation: Use an LLM tool to produce step-by-step guidance for fixing detected vulnerabilities in plain English.
- Clear Dashboard: Display results and remediation steps in a user-friendly, informative dashboard.

## Style Guidelines:

- Primary color: Deep Blue (#2E3192) to convey trust and security.
- Background color: Light Gray (#F0F2F5) for a clean, readable layout.
- Accent color: Teal (#008080) to highlight important information and calls to action.
- Body and headline font: 'Inter' sans-serif for clarity and modern appeal.
- Use simple, clear icons to represent different security configurations and status.
- A clean, well-organized layout to present complex information clearly.
- Subtle animations and transitions to improve user engagement without distraction.