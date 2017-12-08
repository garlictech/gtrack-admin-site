import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { LocalStorage } from '../storage/local-storage.service';
import { Observable } from 'rxjs/Observable';
import { Emitter } from '../emitter';

@Injectable()
export class ApiService extends Emitter {
  constructor(private http: Http, private localStorage: LocalStorage) {
    super();
  }

  get(url: string): Observable<Response> {
    let headers = this.getAuthorizationHeaders();

    return this.http
      .get(url, {
        headers: headers
      })
      .catch(err => this.handleError(err));
  }

  post(url: string, data: any): Observable<Response> {
    let headers = this.getAuthorizationHeaders();

    return this.http
      .post(url, data, {
        headers: headers
      })
      .catch(err => this.handleError(err));
  }

  private getAuthorizationHeaders(): Headers {
    let token = this.localStorage.getItem('token');
    let headers = new Headers();

    headers.append('Authorization', 'JWT ' + token);

    return headers;
  }

  private handleError(err: Response | Error): Observable<Response> {
    if (err instanceof Response) {
      if (err.status === 401) {
        this.emit('unauthorized', err);
      }
    }

    return Observable.throw(err);
  }
}
