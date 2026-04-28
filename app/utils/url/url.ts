import { TConvertSubPathUrlParams } from '@/app/utils/url/types';


const DEFAULT_POKEDEX_SERVICE_BASE_URL = 'http://127.0.0.1:8000';

export function getBaseUrl(): string {
  return process.env.POKEDEX_SERVICE_BASE_URL
    ?? process.env.NEXT_PUBLIC_POKEDEX_SERVICE_BASE_URL
    ?? process.env.AUTH_SERVICE_BASE_URL
    ?? process.env.NEXT_PUBLIC_AUTH_SERVICE_BASE_URL
    ?? DEFAULT_POKEDEX_SERVICE_BASE_URL;
}

export function formatUrl(url: string, path: string, params = {}): string {
  const query = serialize_url(params);
  const filteredUrl = [url, path].filter((i) => i).join('/');

  return `${filteredUrl}${query ? `?${query}` : ''}`;
}

export function serialize_url(value: Record<string, unknown>): string | undefined {
  if (Object.keys(value).some((key) => key)) {
    return new URLSearchParams(value as Record<string, string>).toString();
  }
  return;
}

export function convertSubPathUrl({ by, pathUrl, isParam, subPathUrl, conectorPath }: TConvertSubPathUrlParams): string {
  const currentPathUrl = !by ? pathUrl : `${pathUrl}/${by}`;
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
  if (!value) {
    return;
  }

  const trimmedValue = value.trim();

  return trimmedValue || undefined;
}