# Project instructions

This repository owns Andy Kumeda's personal website. Keep it separate from the sibling `Resume` repository.

## Source boundaries

- Edit website layout and copy here.
- Treat `../Resume/content/career.yaml` as the canonical source for career facts.
- Do not edit `public/andy-kumeda-resume.pdf` manually. Refresh it with `npm run resume:sync` after the Resume repository generates a new public artifact.
- Use private repositories only to verify facts or write safe high-level summaries. Do not expose private implementation details, credentials, customer data, or unreleased claims.

## Changes and verification

- Preserve the equal prominence of personal interests and professional information.
- Keep résumé chronology in the résumé; summarize experience on the website.
- Run `npm run lint` and `npm run build` after site changes.
- Do not deploy, change DNS, or archive `resume-site-hub` without a reviewed cutover and rollback plan.
