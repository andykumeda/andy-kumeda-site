import assert from 'node:assert/strict';
import { test } from 'node:test';
import { publishTarget } from './publish-target.mjs';

test('requires an explicit safe publish host and site directory', () => {
  assert.deepEqual(publishTarget('prod', '/var/www/andy-kumeda-site/'),
    { host: 'prod', directory: '/var/www/andy-kumeda-site' });
  for (const [host, directory] of [[undefined, '/var/www/site'], ['-oProxyCommand=x', '/var/www/site'],
    ['prod', undefined], ['prod', '/'], ['prod', '/var/www/'], ['prod', '/var/www//'],
    ['prod', '/var/www/../etc'], ['prod', '/var/www/site name']]) {
    assert.throws(() => publishTarget(host, directory));
  }
});
