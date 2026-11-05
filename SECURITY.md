# Security Policy

## Supported Versions

We actively maintain and provide security patches for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

## Reporting a Vulnerability

The security and privacy of our visitors and personal data are paramount. If you discover a security vulnerability, please follow responsible disclosure guidelines:

1. **Do not create a public GitHub issue.**
2. Send a detailed vulnerability report via email to **security@qctcommerce.com** or contact the repository maintainer directly.
3. Include the following details in your report:
   - Type of vulnerability (e.g., CSP bypass, XSS, open redirect, dependency flaw)
   - Step-by-step reproduction instructions or Proof of Concept (PoC)
   - Affected URLs or code paths
   - Potential impact and suggested remediation

### Response Timeline & SLA

- **Acknowledgment:** Within 24 hours of report receipt.
- **Triage & Assessment:** Within 48 hours.
- **Remediation & Patch Release:** Critical issues within 7 calendar days; others within 30 calendar days.

## Security Practices in this Codebase

- **Zero Client-Side JavaScript Runtime:** Core content and styling render without client-side framework overhead.
- **Strict Content Security Policy (CSP):** Enforced in production via Cloudflare `_headers` (`default-src 'self'`).
- **Privacy by Design:** Conversion signals (`nese:contact-intent`) dispatch local browser `CustomEvent`s without transmitting telemetry or PII to third parties without prior explicit consent.
- **Dependency Auditing:** Automated `npm audit` quality gate runs on every pull request and push to `main`.
