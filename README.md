# Andy Kumeda personal website

This repository contains the Crossroads personal website for `andykumeda.com`. It gives personal interests—especially long-distance running—the same prominence as professional experience and project work.

## Repository boundaries

The website and résumé intentionally have separate responsibilities:

- `andy-kumeda-site` owns the personal website, its design, site copy, project summaries, links, and deployment.
- The sibling `Resume` repository owns `content/career.yaml`, résumé generation, career-document validation, and the canonical public résumé artifacts.
- `public/andy-kumeda-resume.{pdf,docx,md}` are checked-in public snapshots. Do not edit them manually.

The former `resume-site-hub` repository is retained as a historical GitHub archive. The résumé build remains maintained separately in `../Resume`.

This repository is intentionally public: it contains the website source and safe project summaries, not private repository contents or credentials.

## Local development

```bash
npm install
npm run dev
```

The development server prints the local review URL.

The copy editor is intentionally local-only. While the site is running on the Mini, open `/editor`, edit the copy, and export the JSON draft or use the guarded local publish button. Production renders `/editor` as unavailable and does not link to it.

To enable the local publish button, set `SITE_PUBLISH_TOKEN` in the Mini-only `.env.local` file, restart the dev server, and enter the same token in the editor. The button validates the content, runs lint/build, commits only the site files, pushes the current branch to GitHub, and deploys `dist/client/` to the documented production host.

## Update the résumé

First regenerate the public résumé in the sibling repository, then import its stable public aliases:

```bash
cd ../Resume
npm run resume:build

cd ../andy-kumeda-site
npm run resume:sync
npm run build
```

To import artifacts from a different public résumé directory (or an explicitly named PDF, for backward compatibility):

```bash
npm run resume:sync -- /absolute/path/to/resume-artifacts
# or
npm run resume:sync -- /absolute/path/to/public-resume.pdf
```

## Verification

```bash
npm run lint
npm run build
```

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for the production domains, Nginx/TLS setup, source boundaries, and rollback record.
