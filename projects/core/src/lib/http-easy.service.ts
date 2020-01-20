import { Observable, of, Subject, OperatorFunction } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { HttpClient, HttpRequest, HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpObserve } from '@angular/common/http/src/client';

export const safeGet = <T, R>(project: (value: T, index: number) => Observable<R>, _errorHandler?: (err: any, caught: Observable<R>) => never): OperatorFunction<T, R> => {
  let errorHandler = _errorHandler;
  if(!errorHandler) {
    errorHandler = (_, __) => of([]) as never;
  }
  return (source: Observable<T>): Observable<R> => source.pipe(
    switchMap((value, index) =>
      project(value, index).pipe(
        catchError((error, caught) => errorHandler(error, caught))
      )
    ),
  );
};

export class HttpEasyService extends HttpClient {

  request(first: string|HttpRequest<any>, url?: string, options: {
    body?: any,
    headers?: HttpHeaders|{[header: string]: string | string[]},
    observe?: HttpObserve,
    params?: HttpParams|{[param: string]: string | string[]},
    reportProgress?: boolean,
    responseType?: 'arraybuffer'|'blob'|'json'|'text',
    withCredentials?: boolean,
  } = {}): Observable<any> {
    return super.request(first, url, options);
  }


}


export interface CustomErrorHandler {
  handleError: <T, R>(err: any, caught: Observable<T>) => OperatorFunction<T, T | R>
}

export class DefaultErrorHandler implements CustomErrorHandler {

  constructor(private cache?: Subject<any>) {}

  public handleError<T, R>(err: any, caught: Observable<T>): OperatorFunction<T, T> {
    return (source: Observable<T>): Observable<T> => {
      return source.pipe(
        catchError(_ => {
          this.cacheError(_);
          return of([] as any);
        })
      )
    }
  }

  private cacheError(error: any): void {
    if(this.cache) {
      this.cache.next(error);
    }
  }

}
