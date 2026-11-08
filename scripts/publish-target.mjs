/** Resolve the explicitly configured SSH destination before modifying or publishing content. */
export function publishTarget(host, directory) {
  if (!host || !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(host)) {
    throw new Error('Set SITE_PUBLISH_HOST to a valid SSH host in .env.local.');
  }
  if (!directory || !/^\/var\/www\/[A-Za-z0-9_-][A-Za-z0-9._-]*(?:\/[A-Za-z0-9_-][A-Za-z0-9._-]*)*\/?$/.test(directory)) {
    throw new Error('Set SITE_PUBLISH_DIRECTORY to a site directory under /var/www in .env.local.');
  }
  return { host, directory: directory.replace(/\/+$/, '') };
}
