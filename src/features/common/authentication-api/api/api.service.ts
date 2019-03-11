import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LocalStorage } from '../storage/local-storage.service';

import * as Actions from '../store/actions';

@Injectable()
export class ApiService {
  constructor(
    private readonly _http: HttpClient,
    private readonly _localStorage: LocalStorage,
    private readonly _store: Store<any>
  ) {}

  get<T = any>(url: string): Observable<T> {
    const headers = this.getAuthorizationHeaders();

    return this._http
      .get<T>(url, {
        headers
      })
      .pipe(catchError(err => this.handleError(err)));
  }

  post<T = any>(url: string, data: any): Observable<T> {
    const headers = this.getAuthorizationHeaders();

    return this._http
      .post<T>(url, data, {
        headers
      })
      .pipe(catchError(err => this.handleError(err)));
  }

  private getAuthorizationHeaders(): HttpHeaders {
    const token = this._localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `JWT ${token}`
    });
  }

  private handleError(err: HttpErrorResponse): Observable<any> {
    if (!(err.error instanceof ErrorEvent) && err.status === 401) {
      this._store.dispatch(new Actions.Unauthorized());
    }

    return throwError(err);
  }
}
