import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
import { writeFile, rename } from 'node:fs/promises';
import { join } from 'node:path';
import { sites } from '@openai/sites-vite-plugin';
import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { defineConfig, loadEnv, type ViteDevServer } from 'vite';
import hostingConfig from './.openai/hosting.json';
import { defaultSiteContent } from './app/site-content';
import { publishTarget } from './scripts/publish-target.mjs';

const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  '00000000-0000-4000-8000-000000000000';

const { d1, r2 } = hostingConfig;
const execFileAsync = promisify(execFile);
const publishFiles = [
  'README.md', 'app/crossroads-site.tsx', 'app/editor/page.tsx', 'app/globals.css',
  'app/layout.tsx', 'app/site-content-store.ts', 'app/site-content.ts', 'app/site-editor.tsx',
  'app/site-menu.tsx', 'public/ak-logo-orange-round.png', 'vite.config.ts',
];

function sameShape(value: unknown, template: unknown, depth = 0): boolean {
  if (depth > 12 || typeof value !== typeof template) return false;
  if (typeof template === 'string') return typeof value === 'string' && value.length <= 10000;
  if (template === null || value === null) return template === value;
  if (Array.isArray(template)) return Array.isArray(value) && value.length <= 100 && value.every((item, index) => sameShape(item, template[index % Math.max(template.length, 1)], depth + 1));
  if (typeof template === 'object') {
    if (typeof value !== 'object' || Array.isArray(value)) return false;
    const expected = Object.keys(template).sort();
    const actual = Object.keys(value as object).sort();
    return expected.length === actual.length && expected.every((key, index) => key === actual[index] && sameShape((value as Record<string, unknown>)[key], (template as Record<string, unknown>)[key], depth + 1));
  }
  return true;
}

function localPublishPlugin() {
  return {
    name: 'local-site-publish',
    apply: 'serve' as const,
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (request, response, next) => {
        if (request.url !== '/__site_publish' || request.method !== 'POST') return next();
        const token = process.env.SITE_PUBLISH_TOKEN;
        if (!token || request.headers['x-site-publish-token'] !== token) {
          response.statusCode = token ? 401 : 503;
          response.setHeader('Content-Type', 'application/json');
          response.end(JSON.stringify({ error: token ? 'Invalid publish token.' : 'SITE_PUBLISH_TOKEN is not configured.' }));
          return;
        }
        try {
          const target = publishTarget(process.env.SITE_PUBLISH_HOST, process.env.SITE_PUBLISH_DIRECTORY);
          let body = '';
          for await (const chunk of request) {
            body += chunk;
            if (body.length > 1_000_000) throw new Error('Request is too large.');
          }
          const parsed = JSON.parse(body) as { content?: unknown };
          if (!sameShape(parsed.content, defaultSiteContent)) throw new Error('Content does not match the site content model.');
          const contentSource = `export const defaultSiteContent = ${JSON.stringify(parsed.content, null, 2)} as const;\n\nexport type SiteContent = typeof defaultSiteContent;\n\nexport const contentSections = [\n  { id: 'hero', label: 'Hero' }, { id: 'running', label: 'Running' }, { id: 'work', label: 'Work' }, { id: 'stats', label: 'Stats' }, { id: 'projects', label: 'Projects' }, { id: 'interests', label: 'Interests' }, { id: 'sections', label: 'Section headings' }, { id: 'footer', label: 'Footer' },\n];\n`;
          const contentPath = join(process.cwd(), 'app/site-content.ts');
          const temporaryPath = `${contentPath}.publish.tmp`;
          await writeFile(temporaryPath, contentSource, 'utf8');
          await rename(temporaryPath, contentPath);
          const run = async (command: string, args: string[], options: Record<string, unknown> = {}) => (await execFileAsync(command, args, { cwd: process.cwd(), maxBuffer: 2_000_000, ...options })).stdout.trim();
          await run('npm', ['run', 'lint']);
          await run('npm', ['run', 'build']);
          await run('git', ['add', '--', ...publishFiles]);
          const staged = await run('git', ['diff', '--cached', '--quiet']).catch(() => 'changed');
          if (staged === '') throw new Error('No changes to publish.');
          await run('git', ['commit', '-m', 'Publish site updates from local editor']);
          const branch = await run('git', ['branch', '--show-current']);
          await run('git', ['push', 'origin', branch]);
          await run('rsync', ['-avz', '--no-owner', '--no-group', '--delete', '--chmod=Du=rwx,Dg=rx,Do=rx,Fu=rw,Fg=r,Fo=r', 'dist/client/', `${target.host}:${target.directory}/`]);
          await run('ssh', [target.host, 'sudo nginx -t && sudo systemctl reload nginx']);
          response.statusCode = 200;
          response.setHeader('Content-Type', 'application/json');
          response.end(JSON.stringify({ ok: true, branch }));
        } catch (error) {
          response.statusCode = 500;
          response.setHeader('Content-Type', 'application/json');
          response.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Publish failed.' }));
        }
      });
    },
  };
}

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === 'seatbelt';

const localBindingConfig = {
  main: 'vinext/server/app-router-entry',
  compatibility_flags: ['nodejs_compat'],
  d1_databases: d1
    ? [
        {
          binding: d1,
          database_name: 'site-creator-d1',
          database_id: SITE_CREATOR_PLACEHOLDER_DATABASE_ID,
        },
      ]
    : [],
  r2_buckets: r2
    ? [
        {
          binding: r2,
          bucket_name: 'site-creator-r2',
        },
      ]
    : [],
};

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  process.env.SITE_PUBLISH_TOKEN ??= env.SITE_PUBLISH_TOKEN;
  process.env.SITE_PUBLISH_HOST ??= env.SITE_PUBLISH_HOST;
  process.env.SITE_PUBLISH_DIRECTORY ??= env.SITE_PUBLISH_DIRECTORY;
  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= 'false';
  process.env.WRANGLER_LOG_PATH ??= '.wrangler/logs';
  process.env.MINIFLARE_REGISTRY_PATH ??= '.wrangler/registry';

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import('@cloudflare/vite-plugin');

  return {
    css: { postcss: { plugins: [tailwindcss()] } },
    server: {
      host: true,
      ...(isCodexSeatbeltSandbox ? { watch: { useFsEvents: false, usePolling: true } } : {}),
    },
    plugins: [
      localPublishPlugin(),
      vinext(),
      sites(),
      cloudflare({
        viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] },
        config: localBindingConfig,
      }),
    ],
  };
});
