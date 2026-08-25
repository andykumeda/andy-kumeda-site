# Deployment record

## Current production

Crossroads is served as a static export from the mini (`web`) at `/var/www/andy-kumeda-site`.
Nginx configuration is `/etc/nginx/sites-available/andy-kumeda-site`, enabled through
`/etc/nginx/sites-enabled/andy-kumeda-site`.

The following apex domains resolve to the same site and returned HTTP 200 after cutover:

- `andykumeda.com`
- `kumeda.com`
- `andyk.ai`
- `andyk.io`
- `andyk.link`
- `andyk.xyz`

Cloudflare DNS A records point at the mini's public origin `154.12.247.118`. Existing
mail, verification, and unrelated subdomain records were left in place. `kumeda.com`
was changed from Cloudflare Flexible SSL to Strict SSL so HTTPS reaches the origin
without a redirect loop.

## TLS

The origin certificate is managed by Certbot as `andy-kumeda-site`:

`/etc/letsencrypt/live/andy-kumeda-site/{fullchain.pem,privkey.pem}`

It covers all six apex names and renews through the existing Certbot scheduler.

## Source boundaries

- This public repository owns the site layout, copy, assets, and deployment configuration.
- `/Users/andy/Dev/Resume` remains the private résumé source and build pipeline.
- Run `npm run resume:sync` here to refresh the public résumé PDF, DOCX, and Markdown snapshots from the Resume repo.
- The old `andykumeda/resume-site-hub` repository is archived for history; its résumé build is not the website source of truth.

## Rollback

The prior Nginx apex configuration was preserved on the mini as
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
