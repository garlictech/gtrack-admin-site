import { Injectable } from '@angular/core';
import { Observable, Subject, ReplaySubject } from 'rxjs';

@Injectable()
export class OauthWindowMockService {
  public subject: ReplaySubject<string>;

  public changeUrl$: Subject<string>;

  constructor() {
    this.subject = new ReplaySubject<string>(1);
    this.changeUrl$ = new Subject<string>();
  }

  public callback = (url: string) => {
    /* EMPTY ON PURPOSE */
  }

  public open(loginUrl: string, parameter = 'access_token'): Observable<any> {
    this.changeUrl(loginUrl);
    return this.subject.asObservable();
  }

  public close(): void {
    // do nothing
  }

  public changeUrl(url: string): void {
    this.changeUrl$.next(url);

    if (url) {
      this.callback(url);
    }
  }
}
