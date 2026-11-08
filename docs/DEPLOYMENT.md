# Deployment record

## Production migration preflight — November 7, 2026

Owner: current agent. State: **Deployed; real editor-publish verification pending**. The old VPS is `staging` (Tailscale `100.79.30.68`); the new VPS is `prod` (Tailscale `100.107.40.122`). `andykumeda.com` and `kumeda.com` now point to prod through Cloudflare, with the original proxy settings retained; public HTTPS returned 200 for both and tagged requests reached the prod nginx access log. The staging nginx vhost still serves `andyk.ai`, `andyk.link`, and `andyk.xyz`; their DNS and routing were not changed during this two-domain cutover. `andyk.io` is configured in nginx but is not in the current staging certificate SAN list.

The existing `/var/www/andy-kumeda-site` was copied to `/var/www/andy-kumeda-preflight` on prod; SHA-256 manifests matched all 37 regular files. An isolated temporary nginx on prod loopback port 18084 passed configuration validation and served the same homepage under both hostnames; SPA fallback, logo, and résumé comparisons passed. That temporary listener was stopped.

Prod has a separate Let's Encrypt certificate, `andy-personal-prod`, for `andykumeda.com` and `kumeda.com`. It expires February 6, 2027 at 03:12 UTC (February 5 at 7:12 p.m. Pacific). Certbot was reconfigured from manual DNS to webroot `/var/www/site-acme` using a temporary validation bridge, which was subsequently stopped; the Certbot timer is active. After cutover, `certbot renew --cert-name andy-personal-prod --dry-run --non-interactive` passed via the public DNS route. Its temporary DNS challenge records were removed; a separate `_acme-challenge.kumeda.com` TXT record remains and must not be removed without verifying ownership. Prod nginx `/etc/nginx/sites-available/andy-personal` is enabled with `/var/www/andy-kumeda-site` as its public document root; `/etc/nginx/conf.d/personal-preflight.conf` also serves the verified copy on loopback `127.0.0.1:18446`. `nginx -t`, direct-to-prod HTTPS, and public HTTPS passed for both apexes.

Staging has a separate Let's Encrypt certificate, `andy-personal-staging`, covering `staging.andykumeda.com` and `staging.kumeda.com`. It expires February 6, 2027 at 03:14 UTC (February 5 at 7:14 p.m. Pacific). Its temporary DNS challenge records were removed. Its renewal configuration was changed to webroot `/var/www/andy-staging-acme`; the operator reports a successful staging renewal simulation and the Certbot timer is active. The public nginx vhost `/etc/nginx/sites-available/andy-personal-staging` is enabled, serving the independent staging copy with `X-Robots-Tag: noindex, nofollow`. Both explicit staging A records point DNS-only to `154.12.247.118` with 60-second TTL; the `*.andykumeda.com` wildcard remains in place. Both public staging hostnames returned certificate-valid HTTPS 200 and the noindex header; `nginx -t` passed. The loopback preflight `/etc/nginx/conf.d/personal-staging-preflight.conf` remains on `127.0.0.1:18447`.

Both current staging HTTPS routes use only the static export. The source's editor route explicitly rejects production, and its publish middleware exists only in the Vite development server. On the staging loopback preview, `GET /editor` returned the same static homepage fallback; a no-token `POST /__site_publish` returned 405 for both staging hostnames on loopback and public HTTPS. Editor-related code is present in static JavaScript, but this test did not expose a publish backend. Never proxy the staging hostname to the local dev server.

The local editor is launched from the Mini with `npm run dev -- --hostname 127.0.0.1`, then opened at the printed URL's `/editor` path. The CLI hostname flag matters because the Vite configuration otherwise binds to all network interfaces. Before starting, inspect the preferred port's owner; the server reports its actual address. No matching Node/Vite TCP listener was visible during preflight. The former hardcoded `web` SSH host was replaced on source `main` with validated `SITE_PUBLISH_HOST` and `SITE_PUBLISH_DIRECTORY` settings. The Mini-only `.env.local` now sets them to `prod` and `/var/www/andy-kumeda-site`; target validation, an `rsync` dry run, and remote `nginx -t` passed. Restart an existing editor session to load the change. A real editor publish is not yet tested.

Branch checks: the publish-target and content-shape tests, `npx tsc --noEmit --incremental false`, `npm run lint`, and `npm run build` passed. The build's temporary loopback prerender listener exited when the build completed. The prior pre-existing `sameShape` TypeScript error was corrected with an explicit string type guard; focused tests cover string bounds and nested values. A real editor publish remains untested.

### Cutover record and remaining checks

1. The site copy, direct HTTPS, nginx configuration, and static staging subdomains were verified before the two apex A records were switched to prod `64.23.190.64`; proxy mode and unrelated records were preserved. Public HTTPS and prod access-log evidence passed after cutover. Preserve the other aliases on staging until separately reviewed.
2. Prod and staging certificate webroot renewal both passed staging simulations and their Certbot timers are active. No private keys were copied.
3. Restart the local editor to load `main` and its explicit prod target before a future publish. A safe target validation, `rsync` dry run, and remote `nginx -t` passed; a real editor publish remains untested. This is a static site with no database.

Rollback: first stop editor publishing, preserve any production changes and reconcile them back to staging, then restore the saved two apex A records to `154.12.247.118` with their original proxy settings. The original staging vhost and site files remain in place; verify both HTTPS names through Cloudflare after propagation. Preserve the separate staging subdomain records. Do not revert or delete unrelated aliases, certificates, or nginx routes. Repoint the editor explicitly to the correct target after the rollback.

## Current production

Crossroads is served as a static export from `prod` at `/var/www/andy-kumeda-site` for `andykumeda.com` and `kumeda.com`. Nginx configuration is `/etc/nginx/sites-available/andy-personal`, enabled through `/etc/nginx/sites-enabled/andy-personal`. Independent staging is hosted at `staging.andykumeda.com` and `staging.kumeda.com` on the old VPS.

The following apex domains historically used the same staging site; only the first two were moved to prod in this cutover:

- `andykumeda.com`
- `kumeda.com`
- `andyk.ai`
- `andyk.io`
- `andyk.link`
- `andyk.xyz`

Cloudflare DNS A records for `andykumeda.com` and `kumeda.com` now point to the prod origin `64.23.190.64`; independent staging A records point to `154.12.247.118`. Existing
mail, verification, aliases, and unrelated subdomain records were left in place. `kumeda.com`
was changed from Cloudflare Flexible SSL to Strict SSL so HTTPS reaches the origin
without a redirect loop.

## TLS

The prod certificate is managed by Certbot as `andy-personal-prod`; staging subdomains use `andy-personal-staging`. The legacy staging origin certificate is managed as `andy-kumeda-site`:

`/etc/letsencrypt/live/andy-kumeda-site/{fullchain.pem,privkey.pem}`

That legacy certificate covers `andykumeda.com`, `kumeda.com`, `andyk.ai`, `andyk.link`, and `andyk.xyz`, and renews through the existing Certbot scheduler. The old nginx alias `andyk.io` is not in it.

## Source boundaries

- This public repository owns the site layout, copy, assets, and deployment configuration.
- `/Users/andy/Dev/Resume` remains the private résumé source and build pipeline.
- Run `npm run resume:sync` here to refresh the public résumé PDF, DOCX, and Markdown snapshots from the Resume repo.
- The old `andykumeda/resume-site-hub` repository is archived for history; its résumé build is not the website source of truth.

## Rollback

The prior Nginx apex configuration was preserved on the old VPS as
`/etc/nginx/sites-available/andykumeda.com.resume-site-hub.bak-20260824-201356`.
The old `/var/www/cv` document root was not overwritten. To roll back, restore the
previous enabled vhost symlinks, remove the Crossroads symlink, test with `nginx -t`,
and reload Nginx.

## Rebuild and deploy

From this repository:

```sh
npm run resume:sync
npm run lint
npm run build
```

The static artifact is `dist/client/`. Sync that directory to the exact production
target `/var/www/andy-kumeda-site`, then run `sudo nginx -t && sudo systemctl reload nginx`.

## November 8 structured data

The homepage includes a JSON-LD WebSite linked to a Person, based on the site's public identity and visible GitHub/LinkedIn links. A scoped deploy uses the existing production HTML with the tested schema inserted, retaining the live asset bundle. Local lint, static build, JSON parsing and built-output-to-release schema comparison passed. Google rich-result and search indexing were not tested.
