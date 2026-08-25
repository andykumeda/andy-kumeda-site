# Andy Kumeda personal website

This repository contains the Crossroads personal website for `andykumeda.com`. It gives personal interests—especially long-distance running—the same prominence as professional experience and project work.

## Repository boundaries

The website and résumé intentionally have separate responsibilities:

- `andy-kumeda-site` owns the personal website, its design, site copy, project summaries, links, and deployment.
- The sibling `Resume` repository owns `content/career.yaml`, résumé generation, career-document validation, and the canonical public résumé artifacts.
- `public/andy-kumeda-resume.pdf` is a checked-in public snapshot. Do not edit it manually.

The former `resume-site-hub` repository still supplies the current production site. Keep it intact until Crossroads is deployed and verified at `andykumeda.com`. After cutover, mark it historical and archive it on GitHub rather than deleting it.

## Local development

```bash
npm install
npm run dev
```

The development server prints the local review URL.

## Update the résumé

First regenerate the public résumé in the sibling repository, then import its stable public alias:

```bash
cd ../Resume
npm run resume:build

cd ../andy-kumeda-site
npm run resume:sync
npm run build
```

To import a different public PDF explicitly:

```bash
npm run resume:sync -- /absolute/path/to/public-resume.pdf
```

## Verification

```bash
npm run lint
npm run build
```

No production deployment workflow has been assigned to this repository yet. Do not update `andykumeda.com` until the deployment and rollback path has been reviewed.
