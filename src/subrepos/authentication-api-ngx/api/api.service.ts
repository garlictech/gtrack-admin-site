import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Http, Headers, Response } from '@angular/http';
import { LocalStorage } from '../storage/local-storage.service';
import { Observable } from 'rxjs';
import * as Actions from '../store/actions';

@Injectable()
export class ApiService {
  constructor(private _http: Http, private _localStorage: LocalStorage, private _store: Store<any>) {}

  get(url: string): Observable<Response> {
    const headers = this.getAuthorizationHeaders();

    return this._http
      .get(url, {
        headers: headers
      })
      .catch(err => this.handleError(err));
  }

  post(url: string, data: any): Observable<Response> {
    const headers = this.getAuthorizationHeaders();

    return this._http
      .post(url, data, {
        headers: headers
      })
      .catch(err => this.handleError(err));
  }

  private getAuthorizationHeaders(): Headers {
    const token = this._localStorage.getItem('token');
    const headers = new Headers();

    headers.append('Authorization', 'JWT ' + token);

    return headers;
  }

  private handleError(err: Response | Error): Observable<Response> {
    if (err instanceof Response) {
      if (err.status === 401) {
        this._store.dispatch(new Actions.Unauthorized());
      }
    }

    return Observable.throw(err);
  }
}
