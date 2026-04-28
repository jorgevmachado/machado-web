export type IServiceConfig = {
  token?: string;
  baseUrl: string;
}

export type IBaseServiceConfig = Pick<IServiceConfig, 'baseUrl'> & {
  headers?: Record<string, string>;
};

export type IBaseResponse = {
  message: string;
}

export type IQueryParameters = {
  page?: number;
}

export type IPaginate<T> = {
  next: string;
  items: Array<T>;
}