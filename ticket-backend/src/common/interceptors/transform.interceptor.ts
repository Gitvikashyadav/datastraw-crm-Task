import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: true;
  statusCode: number;
  data: T;
}

/**
 * Wraps every successful controller response in a consistent envelope:
 * { success: true, statusCode, data }
 * Mirrors the shape of HttpExceptionFilter's error envelope so the
 * frontend can rely on `success` alone to branch its handling.
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const httpContext = context.switchToHttp();
    const statusCode = httpContext.getResponse().statusCode;

    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode,
        data,
      })),
    );
  }
}