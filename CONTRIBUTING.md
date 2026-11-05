# Contributing to Neşe Alkaya Web Platform

Thank you for your interest in contributing to this repository. To maintain ultra-high engineering rigor, aesthetic integrity, and multi-language parity, all contributions must adhere to the standards outlined below.

---

## 1. Architectural Philosophy

1. **Static-First & Zero Slop:** Every page is pre-rendered at build time with Astro. No unnecessary client-side JavaScript libraries, heavy UI frameworks, or extraneous dependencies are permitted.
2. **Dual-Language Parity (TR & DE):** Any content, service, or blog addition in Turkish (`/`) must have an exact, culturally nuanced counterpart in German (`/de/`).
3. **Deterministic Quality Gates:** Pull requests cannot be merged unless `npm run build` (which includes `verify-build.mjs`) succeeds with **0 failures**, and all 54 routes maintain valid canonicals, reciprocal `hreflang`, and JSON-LD schemas.

---

## 2. Development Workflow

### Prerequisites
- **Node.js:** v22.0.0 or higher
- **npm:** v10.0.0 or higher
- **Git:** Standard git client

### Local Setup
```bash
# Clone the repository
git clone https://github.com/teyfikgokdemir/nese-alkaya.git
cd nese-alkaya

# Install dependencies
npm install

# Start development server
npm run dev

# Run full production build & verify test suite
npm run build
```

---

## 3. Git Commit Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` A new page, service, feature, or localized content
- `fix:` Bug fix in markup, styling, metadata, or verification scripts
- `docs:` Documentation improvements (README, architecture, legal notes)
- `perf:` Performance optimizations (image sizes, CSS slimming, font loading)
- `style:` Design refinements, typography, spacing (without functional logic changes)
- `refactor:` Code restructuring without altering behavior or build output
- `ci:` Updates to GitHub Actions workflows or automated quality gates

---

## 4. Verification & Testing Checklist

Before opening a pull request, ensure every item below passes:

1. [ ] `npm run check` passes with 0 TypeScript/Astro diagnostics.
2. [ ] `npm run build` completes cleanly and executes `verify-build.mjs` with:
   - Exactly 54 indexable pages
   - Exactly 16 blog posts (8 TR + 8 DE)
   - Exactly 26 service variations (13 TR + 13 DE)
   - Zero broken internal links
   - Zero missing schema properties
3. [ ] `npm run indexnow:check` validates offline IndexNow readiness.
4. [ ] Mobile responsiveness verified on small viewports (≤ 390px).
5. [ ] Accessibility (WCAG 2.1 AA/AAA) verified: keyboard navigation, screen reader labels, color contrast.
