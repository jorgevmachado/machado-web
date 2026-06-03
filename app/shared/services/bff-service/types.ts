import type { TPaginatedListResponse } from '@/app/ds';

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