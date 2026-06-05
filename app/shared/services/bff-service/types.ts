import type { TPaginatedListResponse } from '@/app/ds';
import { RequestConfig } from '@/app/shared';

type TBffResponse = {
  error: boolean;
  status: number;
  message: string;
  i18nMessage: string;
};

export type BffResponse<T> = TBffResponse & {
  data?: T | DataListResponse<T>;
};

export type DataListResponse<T> = Array<T> | TPaginatedListResponse<T>;

export type BffListResponse<T> = TBffResponse & {
  data?: DataListResponse<T>;
};


export type BffDetailResponse<T> = TBffResponse & {
  data?: T;
};

export type BffGetParams = {
  param?: string;
  config?: Omit<RequestConfig, 'body'>;
  queryString?: string;
  i18NMessage?: string;
}

export type BffPathParams<B> = {
  param: string;
  config?: RequestConfig<B>;
  i18NMessage?: string;
}

export type BffPostParams<B> = Omit<BffPathParams<B>, 'param'> & {
  param?: string;
};