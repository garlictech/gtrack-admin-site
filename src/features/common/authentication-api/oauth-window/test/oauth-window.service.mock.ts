import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';

@Injectable()
export class OauthWindowMockService {
  subject: ReplaySubject<string>;

  changeUrl$: Subject<string>;

  constructor() {
    this.subject = new ReplaySubject<string>(1);
    this.changeUrl$ = new Subject<string>();
  }

  callback = (url: string) => {
    /* EMPTY ON PURPOSE */
  };

  open(loginUrl: string, parameter = 'access_token'): Observable<any> {
    this.changeUrl(loginUrl);

    return this.subject.asObservable();
  }

  close(): void {
    // do nothing
  }

  changeUrl(url: string): void {
    this.changeUrl$.next(url);

    if (url) {
      this.callback(url);
    }
  }
}
