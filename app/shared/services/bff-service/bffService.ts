import { Http ,RequestConfig ,ResponseError } from '@/app/shared/services/http';
import {
  BffDetailResponse ,
  BffListResponse ,
  BffResponse ,
  DataListResponse,
} from '@/app/shared/services/bff-service/types';
import { buildQueryString } from '@/app/utils';

export abstract class BffBaseServiceAbstract<T> extends Http {
  protected readonly baseUrl: string;
  protected readonly pathUrl: string;
  protected readonly domain: string;

  protected constructor(
    domain: string,
    pathUrl: string,
    baseUrl: string = '/api'
  ) {
    super(baseUrl, {});
    this.domain = domain;
    this.pathUrl = pathUrl;
    this.baseUrl = baseUrl;
  }

  public isResponseError = <T>(response: DataListResponse<T> | ResponseError | T): response is ResponseError => {
    return Boolean(response && typeof response === 'object' && 'statusCode' in response);
  };

  public validateResponse = <T>(
    response: DataListResponse<T> | ResponseError | T,
    i18nMessage: string
  ): BffResponse<T> => {
    if (this.isResponseError(response)) {
      return {
        error: true,
        status: response.statusCode,
        message: response.message,
        i18nMessage,
      };
    }
    return {
      data: response,
      error: false,
      status: 200,
      message: 'OK',
      i18nMessage,
    };
  };

  public fetchOne = async (identifier: string): Promise<BffDetailResponse<T>> => {
    const response = await this.get<T | ResponseError>(`${this.pathUrl}/${identifier}`);
    const validatedResponse = this.validateResponse<T>(response, `${this.domain}.detail.loadError`);
    return {
      ...validatedResponse,
      data: validatedResponse.data as T,
    };
  };

  public fetchAll = async <TFilter>(
    filters: TFilter,
    page?: number,
    perPage?: number,
  ): Promise<BffListResponse<T>> => {

    const queryString = buildQueryString<TFilter>(filters, page, perPage);
    const path = queryString === '' ? this.pathUrl : `${this.pathUrl}?${queryString}`;
    const response = await this.get<DataListResponse<T> | ResponseError>(path);

    const validatedResponse = this.validateResponse<T>(response, `${this.domain}.list.loadError`);
    return {
      ...validatedResponse,
      data: validatedResponse.data as DataListResponse<T>,
    };
  };

  public fetchList = async <TFilter>(
    filters: TFilter,
    page?: number,
    perPage?: number,
  ): Promise<BffListResponse<T>> => {
    return await this.fetchAll(filters, page, perPage);
  };

  public bff_path = async <B, T = unknown>(
    path: string,
    config?: RequestConfig<B>,
    i18NMessage: string = `${this.domain}.update.loadError`
  ): Promise<BffDetailResponse<T>> => {
    const response = await this.path<B, T>(`${this.pathUrl}/${path}`, config);
    const validatedResponse = this.validateResponse<T>(response, i18NMessage);
    return {
      ...validatedResponse,
      data: validatedResponse.data as T,
    };
  };

  public bff_post = async <B, T = unknown>(
    path: string,
    config?: RequestConfig<B>,
    i18NMessage: string = `${this.domain}.create.loadError`
  ): Promise<BffDetailResponse<T>> => {
    const response = await this.post<B, T>(`${this.pathUrl}/${path}`, config);
    const validatedResponse = this.validateResponse<T>(response, i18NMessage);
    return {
      ...validatedResponse,
      data: validatedResponse.data as T,
    };
  };
}