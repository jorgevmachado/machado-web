import { TConvertSubPathUrlParams } from '@/app/utils/url/types';


const DEFAULT_POKEDEX_SERVICE_BASE_URL = 'http://127.0.0.1:8000';

export function getBaseUrl(): string {
  return process.env.POKEDEX_SERVICE_BASE_URL
    ?? process.env.NEXT_PUBLIC_POKEDEX_SERVICE_BASE_URL
    ?? process.env.AUTH_SERVICE_BASE_URL
    ?? process.env.NEXT_PUBLIC_AUTH_SERVICE_BASE_URL
    ?? DEFAULT_POKEDEX_SERVICE_BASE_URL;
}

export function formatUrl(url: string, path: string, params?: Record<string, unknown>): string {
  const query = serialize_url(params);
  const filteredUrl = [url, path].filter(Boolean).join('/');

  return query ? `${filteredUrl}?${query}` : filteredUrl;
}

export function serialize_url(value?: Record<string, unknown>): string | undefined {
  if (!value || Object.keys(value).length === 0) {
    return undefined;
  }

  return new URLSearchParams(value as Record<string, string>).toString();
}

export function convertSubPathUrl({ by, pathUrl, isParam, subPathUrl, conectorPath }: TConvertSubPathUrlParams): string {
  const currentPathUrl = by ? `${pathUrl}/${by}` : pathUrl;
  if (!subPathUrl) {
    const currentParam = conectorPath ? `/${conectorPath}` : '';
    return isParam ? `${currentPathUrl}${currentParam}` : currentPathUrl;
  }
  if (!conectorPath) {
    return `${currentPathUrl}/${subPathUrl}`;
  }
  return `${currentPathUrl}/${conectorPath}/${subPathUrl}`;
}

export function sanitizedParams(value: string | null): string | undefined {
  return value?.trim() || undefined;
}

export function buildDetailUrl(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  return segments[segments.length - 1];
}

type BuildPathRelationsParams = {
  param?: string;
  origin?: string;
  domain?: string;
  relation: string;
  identifier: string;
}

export const buildPathRelations = ({
  param,
  origin,
  domain = 'catalog',
  relation,
  identifier
}: BuildPathRelationsParams) => {
  const path = `/${domain}/${ relation }/${ identifier }`;
  if (origin) {
    const originPath = `${ path }?origin=${ origin }`;
    return !param ? originPath : `${ originPath }&param=${ param }`;
  }
  return path;
};