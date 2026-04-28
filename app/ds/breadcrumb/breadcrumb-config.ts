import type { BreadcrumbItem } from './types';

/**
 * Maps URL path segments to human-readable breadcrumb labels.
 *
 * Add new route segments here when new pages are created.
 * Segment keys should match the exact URL fragment (e.g. 'register-user').
 */
export const ROUTE_SEGMENT_LABELS: Record<string, string> = {
  home: 'Home',
  pokedex: 'Pokédex',
  'register-user': 'Register User',
};

const HOME_BREADCRUMB: BreadcrumbItem = {
  label: 'Home',
  href: '/home',
  isCurrent: false,
};

const formatFallbackLabel = (segment: string): string =>
  segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

/**
 * Builds a breadcrumb trail from a URL pathname.
 *
 * Rules:
 * - Routes NOT starting with /home have a "Home" root injected.
 * - The last segment is always marked as current (non-clickable).
 * - Returns an empty array for the /home root itself (no hierarchy to show).
 *
 * @example
 * buildBreadcrumbs('/home')                // []
 * buildBreadcrumbs('/home/register-user')  // [Home, Register User*]
 * buildBreadcrumbs('/pokedex')             // [Home, Pokédex*]
 */
export const buildBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return [];
  if (segments.length === 1 && segments[0] === 'home') return [];

  const items: BreadcrumbItem[] = [];

  const needsHomeRoot = segments[0] !== 'home';

  if (needsHomeRoot) {
    items.push(HOME_BREADCRUMB);
  }

  segments.forEach((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = ROUTE_SEGMENT_LABELS[segment] ?? formatFallbackLabel(segment);
    const isCurrent = index === segments.length - 1;

    if (segment === 'home' && !isCurrent) {
      items.push({ label, href, isCurrent: false });
    } else {
      items.push({ label, href, isCurrent });
    }
  });

  return items;
};

