# Deployment record

## Production migration preflight — November 7, 2026

Owner: current agent. State: **In progress; no public cutover**. The old VPS is `staging` (Tailscale `100.79.30.68`); the new VPS is `prod` (Tailscale `100.107.40.122`). The current production origins for `andykumeda.com` and `kumeda.com` still point to staging through Cloudflare. The staging nginx vhost also serves `andyk.ai`, `andyk.link`, and `andyk.xyz`; their DNS and routing must be handled deliberately and must not be inadvertently changed during the two-domain cutover. `andyk.io` is configured in nginx but is not in the current certificate SAN list.

The existing `/var/www/andy-kumeda-site` was copied to `/var/www/andy-kumeda-preflight` on prod; SHA-256 manifests matched all 37 regular files. An isolated temporary nginx on prod loopback port 18084 passed configuration validation and served the same homepage under both hostnames; SPA fallback, logo, and résumé comparisons passed. That temporary listener was stopped.

Prod now has a separate Let's Encrypt certificate, `andy-personal-prod`, for `andykumeda.com` and `kumeda.com`. It expires February 6, 2027 at 03:12 UTC (February 5 at 7:12 p.m. Pacific). It was issued using manual DNS validation and **does not yet renew automatically**. Its temporary challenge records were removed; a separate `_acme-challenge.kumeda.com` TXT record remains and must not be removed without verifying ownership. Prod nginx `/etc/nginx/conf.d/personal-preflight.conf` serves the verified copy on loopback `127.0.0.1:18446` using this certificate. `nginx -t` passed and both hostnames returned 200 with certificate verification enabled. No public nginx route or production A record was changed. Public HTTPS, staging subdomains, automatic renewal, and a real local-editor publish remain untested.

Staging has a separate Let's Encrypt certificate, `andy-personal-staging`, covering `staging.andykumeda.com` and `staging.kumeda.com`. It expires February 6, 2027 at 03:14 UTC (February 5 at 7:14 p.m. Pacific), and was issued using manual DNS validation; **automatic renewal is not configured**. Its temporary challenge records were removed. Staging nginx `/etc/nginx/conf.d/personal-staging-preflight.conf` serves the existing site on loopback `127.0.0.1:18447`; both staging hostnames returned 200 with certificate verification enabled and `nginx -t` passed. There are no dedicated public staging vhosts or explicit staging A records yet; the existing `*.andykumeda.com` wildcard remains in place.

Both current staging HTTPS previews use only the static export. The source's editor route explicitly rejects production, and its publish middleware exists only in the Vite development server. On the staging loopback preview, `GET /editor` returned the same static homepage fallback and a no-token `POST /__site_publish` returned 405 for both staging hostnames. Editor-related code is present in static JavaScript, but this test did not expose a publish backend. Recheck these routes on the final public vhosts; never proxy the staging hostname to the local dev server.

The local editor is launched from the Mini with `npm run dev -- --hostname 127.0.0.1`, then opened at the printed URL's `/editor` path. The CLI hostname flag matters because the Vite configuration otherwise binds to all network interfaces. Before starting, inspect the preferred port's owner; the server reports its actual address. No matching Node/Vite TCP listener was visible during this preflight. The editor formerly hardcoded the obsolete `web` SSH host. This branch requires explicit `SITE_PUBLISH_HOST` and `SITE_PUBLISH_DIRECTORY` settings and validates them before the editor writes or publishes content. The suggested post-cutover values are `prod` and `/var/www/andy-kumeda-site`; both must be set in the Mini-only `.env.local` and tested against a safe destination before relying on the button. The branch is not deployed and existing local editor sessions still run their old code until updated/restarted.

Branch checks: the publish-target and content-shape tests, `npx tsc --noEmit --incremental false`, `npm run lint`, and `npm run build` passed. The build's temporary loopback prerender listener exited when the build completed. The prior pre-existing `sameShape` TypeScript error was corrected with an explicit string type guard; focused tests cover string bounds and nested values. A real editor publish remains untested.

### Reviewed cutover and rollback plan — pending execution

1. Reconfirm live DNS records, traffic, source SHA-256 manifest, and the current nginx ownership; notify the owner of any concurrent site edits. Re-copy to an unused production directory and compare checksums. Create a stable prod document root from this verified copy without overwriting another service.
2. Before switching apex DNS, configure host-specific public HTTPS vhosts using the already issued prod certificate, including a webroot route for renewal. Do not copy certificate private keys. Keep the other aliases on staging until separately reviewed. Add `staging.andykumeda.com` and `staging.kumeda.com` vhosts on staging using the already issued staging certificate and explicit A records to `154.12.247.118`; check for existing conflicting records and preserve the wildcard. Test the staging routes and reconfigure both certificates for automatic renewal. Keep staged aliases on the existing independent filesystem; this is a static site with no database.
3. Review prod nginx with `nginx -t`, test prod by resolving both hostnames to prod while retaining correct Host/SNI and certificate validation, and verify the homepage, static assets, résumé, and fallback. Verify Cloudflare Full (strict) compatibility. Record existing proxied A-record settings and prepare exact rollback.
4. Once the previous checks pass, update only the two apex Cloudflare origins to `64.23.190.64`, preserving proxy mode and unrelated records. Check authoritative records, propagation, certificate and HTTP responses from outside, and confirm both staging subdomains still serve staging. Reconfigure any manually issued DNS-validation certificates for unattended webroot renewal and verify the renewal configuration.
5. Install the reviewed editor target change, set its explicit prod host and directory on the Mini, restart the editor, and verify its target without overwriting current production content. Document the actual live verification; the preview alone is not a publication test.

Rollback: first stop editor publishing, preserve any production changes and reconcile them back to staging, then restore the saved two apex A records to `154.12.247.118` with their original proxy settings. The original staging vhost and site files remain in place; verify both HTTPS names through Cloudflare after propagation. Preserve the separate staging subdomain records. Do not revert or delete unrelated aliases, certificates, or nginx routes. Repoint the editor explicitly to the correct target after the rollback.

## Current production

Crossroads is served as a static export from the old VPS (`staging`, formerly `web`) at `/var/www/andy-kumeda-site`.
Nginx configuration is `/etc/nginx/sites-available/andy-kumeda-site`, enabled through
`/etc/nginx/sites-enabled/andy-kumeda-site`.

The following apex domains resolve to the same site and returned HTTP 200 after cutover:

- `andykumeda.com`
- `kumeda.com`
- `andyk.ai`
- `andyk.io`
- `andyk.link`
- `andyk.xyz`

Cloudflare DNS A records point at the old VPS origin `154.12.247.118`. Existing
mail, verification, and unrelated subdomain records were left in place. `kumeda.com`
was changed from Cloudflare Flexible SSL to Strict SSL so HTTPS reaches the origin
without a redirect loop.

## TLS

The origin certificate is managed by Certbot as `andy-kumeda-site`:

`/etc/letsencrypt/live/andy-kumeda-site/{fullchain.pem,privkey.pem}`

The current certificate covers `andykumeda.com`, `kumeda.com`, `andyk.ai`, `andyk.link`, and `andyk.xyz`, and renews through the existing Certbot scheduler. The old nginx alias `andyk.io` is not in the current certificate.

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
