import { formatUrl } from '@/app/utils';

export type RequestConfig<B = unknown> = {
 body?: B;
 params?: Record<string, unknown>;
 override?: Omit<RequestInit, 'body' | 'method'>;
}

export type ResponseError = {
 error: string;
 message: string;
 statusCode: number;
}

export abstract class Http {
  private readonly _url: string;
  private readonly _config: RequestInit;

  protected constructor(url: string, config: RequestInit) {
    this._url = url;
    this._config = config;
  }

  get url(): string {
    return this._url;
  }

  get config(): RequestInit {
    return this._config;
  }

  get<T>(
    path: string,
    config: Omit<RequestConfig, 'body'> = { params: {}, override: {} },
  ): Promise<T> {
    const { params, override } = config;

    const url = formatUrl(this.url, path, params);

    return this.send<T>(url, { ...override, method: 'GET' });
  }

  path<B, T = unknown>(
    path: string,
    config: RequestConfig<B> = { params: {}, override: {}, body: {} as B },
  ): Promise<T> {
    const { body, params, override } = config;

    const url = formatUrl(this.url, path, params);

    const isFormData = body instanceof FormData;

    return this.send(url, {
      ...override,
      method: 'PUT',
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  post<B, T = unknown>(
    path: string,
    config: RequestConfig<B> = { params: {}, override: {}, body: {} as B },
  ): Promise<T> {
    const { body, params, override } = config;

    const url = formatUrl(this.url, path, params);

    const isFormData = body instanceof FormData;

    return this.send(url, {
      ...override,
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  remove<T>(
    path: string,
    config: Omit<RequestConfig, 'body'> = { params: {}, override: {} },
  ): Promise<T> {
    const { params, override } = config;

    const url = formatUrl(this.url, path, params);

    return this.send<T>(url, { ...override, method: 'DELETE' });
  }

  private async send<T>(
    url: string,
    { body, method, headers }: RequestInit,
  ): Promise<T> {
    const isFormData = body instanceof FormData;
    const configHeaders = isFormData
      ? { ...this.config.headers, ...headers }
      : { ...this.config.headers, ...headers, 'content-type': 'application/json; charset=UTF-8' };

    const config = {
      ...this.config,
      headers: configHeaders,
      method,
      body,
    };

    return fetch(url, config)
      .then((response) => this.handle(response as unknown as Response))
      .then((handle) => handle && handle.response as T)
      .catch((error) => {
        throw this.errorMessage(error);
      });
  }

  private async handle(response: Response) {
    const status = response.status;
    const success = response.ok;

    let json: Record<string, unknown> | undefined;

    try {
      json = await response.json();
    } catch {
      json = undefined;
    }

    const data = { status, response: json };

    if (!success) {
      throw data;
    }

    return data;
  }

  private errorMessage = (error?: { status: number, response: { detail: string }}): ResponseError => {
    return {
      error: error?.response?.detail ?? 'internal Server Error',
      message: error?.response?.detail ?? 'Internal Server Error',
      statusCode: error?.status ?? 500,
    };
  };

}