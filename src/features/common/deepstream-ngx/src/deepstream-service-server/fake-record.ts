import { Client as DeepstreamClient, Record } from '@garlictech/deepstream-rxjs';
import { Observable, Subject } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

export class FakeRecord<T> extends Record<T> {
  record$: Observable<T>;
  dsClient: DeepstreamClient;

  constructor(connectionString: string, name: string) {
    const client = new DeepstreamClient(connectionString);
    super(client, name);

    this.dsClient = client;
    const subject = new Subject<T>();
    this.record$ = subject.asObservable();
  }

  get(path?: string): Observable<T> {
    return this.dsClient
      .login({
        jwtToken: undefined
      })
      .pipe(
        switchMap(() => super.get()),
        take(1),
        tap(() => this.dsClient.close().subscribe())
      );
  }

  snapshot(path?: string): Observable<T> {
    return this.get(path);
  }
}
