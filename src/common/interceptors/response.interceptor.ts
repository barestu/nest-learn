import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface Response<T> {
  data: T;
  meta?: PaginationMeta;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        if (typeof data?.[1] == 'number') {
          const query = context.switchToHttp().getRequest().query;
          const meta: PaginationMeta = {
            page: query?.page ? +query.page : 1,
            limit: query?.limit ? +query.limit : 10,
            total: data[1] ?? 0,
          };
          return {
            success: true,
            data: data[0],
            meta,
          };
        } else {
          return {
            success: true,
            data,
          };
        }
      }),
    );
  }
}
