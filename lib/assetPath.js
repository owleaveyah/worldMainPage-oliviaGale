const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/**
 * Prefixes root-relative public asset paths with Next.js basePath (e.g. for GitHub Pages).
 */
export function withBasePath(path) {
  if (!path || typeof path !== 'string') return path;
  if (!BASE_PATH || path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}
