import { Http } from '@/app/shared/services/http';

export abstract class BaseServiceAbstract extends Http {
  protected readonly pathUrl: string;

  protected constructor(
    baseUrl: string ,
    pathUrl: string ,
    token?: string ,
  ) {
    const headers: Record<string ,string> = !token ? {} : {
      Authorization: `Bearer ${ token }` ,
    };
    super(baseUrl ,{ headers });
    this.pathUrl = pathUrl;
  }

}