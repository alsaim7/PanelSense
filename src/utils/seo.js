export const SITE_NAME = 'PanelSense';
export const DEFAULT_SITE_URL = 'https://panelsense.vercel.app';

export function getSiteUrl() {
  return (import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '');
}

export function getCanonicalUrl(pathname = '/') {
  const cleanPath = pathname === '/' ? '' : pathname;
  return `${getSiteUrl()}${cleanPath}`;
}

export function truncateDescription(value, fallback) {
  const description = String(value || fallback || '').replace(/\s+/g, ' ').trim();
  return description.length > 158 ? `${description.slice(0, 155).trim()}...` : description;
}

export function panelImageAlt(panel, fallback = 'decorative wall panel design') {
  const parts = [panel?.name, panel?.color, panel?.style, panel?.category]
    .filter(Boolean)
    .map((part) => String(part).trim());

  if (!parts.length) return fallback;
  return `${parts.join(' ')} decorative wall panel design`;
}

export const defaultKeywords = [
  'wall panel designs',
  'decorative wall panels',
  'modern wall panels',
  'wooden wall panels',
  'PVC wall panels',
  'panel images',
  'interior wall panels',
  'laminate panel designs',
  'fluted wall panels',
  'panel catalog',
  'panel finder',
  'decorative panels',
];
