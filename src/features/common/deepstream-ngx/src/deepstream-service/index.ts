import {
  catchError,
  delay,
  filter,
  finalize,
  multicast,
  refCount,
  retryWhen,
  scan,
  switchMap,
  take,
  tap,
  timeout
} from 'rxjs/operators';

import { Inject, Injectable } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs';

import { EAuthRoles } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { Client as DeepstreamClient, List, Query, Record, Rpc } from '@garlictech/deepstream-rxjs';
import { select, Store } from '@ngrx/store';

import { EXTERNAL_DEEPSTREAM_DEPENDENCIES, ExternalDeepstreamDependencies } from '../lib/externals';
import { DebugLog, log } from '../log';
import { DeepstreamPermissionRecordChanged } from '../store/actions';
import { Selectors } from '../store/selectors';

export interface QueryDesc {
  table: string;
  query: Array<any>;
  limit?: number;
  order?: string;
  desc?: boolean;
}

export interface RpcQuery {
  payload: QueryDesc;
}

const OPEN_SEARCH_PROVIDER_SERIALIZE = 'open.search-provider.serialize';

@Injectable()
export class DeepstreamService {
  private dsClient: DeepstreamClient;
  private readonly _liveQueries: { [key: string]: Observable<Array<any>> };

  static getDeepstreamClient(connectionString: string): DeepstreamClient {
    return new DeepstreamClient(connectionString);
  }

  constructor(
    @Inject(EXTERNAL_DEEPSTREAM_DEPENDENCIES) private readonly _externals: ExternalDeepstreamDependencies,
    private readonly _selectors: Selectors,
    private readonly _store: Store<any>
  ) {
    this._liveQueries = {};

    this._init();
  }

  login(token: string): Observable<any> {
    return ((this.dsClient.close() as unknown) as Observable<any>).pipe(
      switchMap(() => this.dsClient.login({ jwtToken: token }))
    );
  }

  getClient(): DeepstreamClient {
    return this.dsClient;
  }

  doQuery<T = any>(queryDesc: QueryDesc, start = 0): Observable<Array<T>> {
    const rpcData: RpcQuery = { payload: { ...queryDesc } };

    return this.callRpc(OPEN_SEARCH_PROVIDER_SERIALIZE, rpcData).pipe(
      switchMap(res => {
        const query = new Query<T>(this.dsClient);

        return this._initLiveQuery(res, query.queryForData(res.name, res.table));
      })
    );
  }

  doPageQuery<T = any>(queryDesc: QueryDesc, currentPage: number, pageSize: number): Observable<Array<T>> {
    const start = currentPage * pageSize;
    const end = start + pageSize;

    const rpcData: RpcQuery = {
      payload: {
        ...queryDesc,
        limit: end
      }
    };

    return this.callRpc(OPEN_SEARCH_PROVIDER_SERIALIZE, rpcData).pipe(
      switchMap(res => {
        const query = new Query<T>(this.dsClient);

        return this._initLiveQuery(res, query.pageableQuery(res.name, start, end, res.table));
      })
    );
  }

  doWindowedQuery<T = any>(queryDesc: QueryDesc, start, end): Observable<Array<T>> {
    const rpcData: RpcQuery = {
      payload: {
        ...queryDesc,
        limit: end
      }
    };

    return this.callRpc(OPEN_SEARCH_PROVIDER_SERIALIZE, rpcData).pipe(
      switchMap(res => {
        const query = new Query<T>(this.dsClient);

        return this._initLiveQuery(res, query.pageableQuery(res.name, start, end, res.table));
      })
    );
  }

  getRecord<T = any>(id: string): Record<T> {
    return new Record<T>(this.dsClient, id);
  }

  getList<T = any>(id: string): List<T> {
    return new List<T>(this.dsClient, id);
  }

  callRpc<T = any>(name: string, data: any, callTimeout = 3000, delayTime = 1000, retry = 3): Observable<T> {
    const rpc = new Rpc(this.dsClient);
    const userSelector = this._store.pipe(
      select(this._selectors.userData),
      take(1)
    );

    return userSelector.pipe(
      switchMap(user => {
        const sentData = {
          ...data,
          userId: user.userId || 'open',
          role: user.role || EAuthRoles.user
        };

        return rpc.make(name, sentData);
      }),
      timeout(callTimeout),
      retryWhen(errors =>
        errors.pipe(
          tap(err => log.error(err)),
          tap(() => log.data('Retry')),
          scan<any, number>((count, err) => {
            if (count >= retry) {
              throw err;
            }

            // We should not retry provider validation errors
            if (typeof err.errorMsg !== 'undefined' && err.errorMsg !== 'INTERNAL_SERVER_ERROR') {
              throw err;
            }

            return count + 1;
          }, 1),
          delay(delayTime)
        )
      )
    );
  }

  listenUserEvents(): Observable<any> {
    const userSelector = this._store.pipe(select(this._selectors.userData));

    return userSelector.pipe(
      filter((user: any) => user.role && user.userId),
      switchMap((user: any) => {
        const topic = `${user.role}/${user.userId}`;

        return new Observable<any>((obs: Observer<any>) => {
          this.dsClient.client.event.subscribe(topic, payload => {
            obs.next(payload);

            return () => this.dsClient.client.event.unsubscribe(topic);
          });
        });
      })
    );
  }

  @DebugLog _init(): void {
    this.dsClient = DeepstreamService.getDeepstreamClient(this._externals.deepstreamConnectionString);

    this.dsClient.errors$.subscribe(error => {
      log.error('Deepstream error: ', error);
    });

    this._store
      .pipe(
        select(this._selectors.permissionRecordName),
        filter(recordName => !!recordName),
        switchMap(recordName => {
          const record = this.getRecord(recordName);

          return record.get();
        }),
        catchError((err, caught) => {
          log.error('Deepstream permission record error', err);

          return caught;
        })
      )
      .subscribe(permissionRecord => {
        log.info('Deepstream permission record changed', permissionRecord);

        this._store.dispatch(new DeepstreamPermissionRecordChanged(permissionRecord));
      });
  }

  private _initLiveQuery<T>(res: any, cb: Observable<Array<T>>): Observable<Array<T>> {
    const runningQuery = this._liveQueries[res.name];
    if (runningQuery) {
      return this._liveQueries[res.name] as Observable<Array<T>>;
    } else {
      const subject = new Subject<Array<T>>();
      const source = cb;
      const liveQuery = source.pipe(
        multicast(subject),
        refCount()
      );
      this._liveQueries[res.name] = liveQuery;

      return liveQuery.pipe(
        finalize(() => {
          log.data('Disposing live query', res.name);
          this._liveQueries[res.name] = undefined;
        })
      );
    }
  }
}
