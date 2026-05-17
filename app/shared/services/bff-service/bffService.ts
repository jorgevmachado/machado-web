import { Http, ResponseError } from '@/app/shared/services/http';
import { BffListResponse, BffResponse, DataListResponse } from '@/app/shared/services/bff-service/types';
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

  public fetchOne = async (identifier: string): Promise<BffResponse<T>> => {
    const resultResponse: BffResponse<T> = {
      error: true,
      status: 500,
      message: 'Internal Server Error',
      i18nMessage: `${this.domain}.detail.loadError`,
    };

    const response = await this.get<T | ResponseError>(`${this.pathUrl}/${identifier}`);

    if (this.isResponseError(response)) {
      resultResponse.status = response.statusCode;
      resultResponse.message = response.message;
      return resultResponse;
    }

    resultResponse.data = response;
    resultResponse.error = false;
    resultResponse.status = 200;
    resultResponse.message = 'OK';
    return resultResponse;
  };

  public fetchAll = async <TFilter>(
    filters: TFilter,
    page?: number,
    perPage?: number,
  ): Promise<BffListResponse<T>> => {
    const resultResponse: BffListResponse<T> = {
      error: true,
      status: 500,
      message: 'Internal Server Error',
      i18nMessage: `${this.domain}.list.loadError`,
    };

    const queryString = buildQueryString<TFilter>(filters, page, perPage);
    const path = queryString === '' ? this.pathUrl : `${this.pathUrl}?${queryString}`;
    const response = await this.get<DataListResponse<T> | ResponseError>(path);

    if (this.isResponseError(response)) {
      resultResponse.status = response.statusCode;
      resultResponse.message = response.message;
      return resultResponse;
    }

    resultResponse.data = response;
    resultResponse.error = false;
    resultResponse.status = 200;
    resultResponse.message = 'OK';
    return resultResponse;
  };

  public fetchList = async <TFilter>(
    filters: TFilter,
    page?: number,
    perPage?: number,
  ): Promise<BffListResponse<T>> => {
    return await this.fetchAll(filters, page, perPage);
  };
}