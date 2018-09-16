import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { LocalStorage } from '../storage/local-storage.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as Actions from '../store/actions';

@Injectable()
export class ApiService {
  constructor(private _http: HttpClient, private _localStorage: LocalStorage, private _store: Store<any>) {}

  get<T = any>(url: string): Observable<T> {
    const headers = this.getAuthorizationHeaders();

    return this._http
      .get<T>(url, {
        headers: headers
      })
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  post<T = any>(url: string, data: any): Observable<T> {
    const headers = this.getAuthorizationHeaders();

    return this._http
      .post<T>(url, data, {
        headers: headers
      })
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  private getAuthorizationHeaders(): HttpHeaders {
    const token = this._localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `JWT ${token}`
    });

    return headers;
  }

  private handleError(err: HttpErrorResponse) {
    if (!(err.error instanceof ErrorEvent) && err.status === 401) {
      this._store.dispatch(new Actions.Unauthorized());
    }

    return throwError(err);
  }
}
