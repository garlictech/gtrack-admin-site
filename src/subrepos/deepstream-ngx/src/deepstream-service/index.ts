import { finalize, switchMap, take, filter, refCount, multicast, catchError } from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
<<<<<<< HEAD
import { Observable, Subject, Observer } from 'rxjs';
=======
import { Observable,  Subject, Observer } from 'rxjs';
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
import { Store, select } from '@ngrx/store';
import { Client as DeepstreamClient, Record, Query, Rpc, List } from '@garlictech/deepstream-rxjs';
import { EAuthRoles } from '../../../provider-client';

import { EXTERNAL_DEEPSTREAM_DEPENDENCIES, IExternalDeepstreamDependencies } from '../lib/externals';
import { Selectors } from '../store/selectors';
import { DeepstreamPermissionRecordChanged } from '../store/actions';
import { log, DebugLog } from '../log';

export interface IQueryDesc {
  table: string;
  query: any[];
  limit?: number;
  order?: string;
  desc?: boolean;
}

export interface IRpcQuery {
  payload: IQueryDesc;
}

@Injectable()
export class DeepstreamService {
<<<<<<< HEAD
=======

>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
  constructor(
    @Inject(EXTERNAL_DEEPSTREAM_DEPENDENCIES) private _externals: IExternalDeepstreamDependencies,
    private _selectors: Selectors,
    private _store: Store<any>
  ) {
    this._init();
  }
  private dsClient: DeepstreamClient;
  private _liveQueries: { [key: string]: Observable<any[]> } = {};

  static getDeepstreamClient(connectionString: string) {
    return new DeepstreamClient(connectionString);
  }

  login(token: string) {
<<<<<<< HEAD
    return this.dsClient.close().pipe(switchMap(() => this.dsClient.login({ jwtToken: token })));
=======
    return this.dsClient.close()
      .pipe(switchMap(() => this.dsClient.login({ jwtToken: token })));
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
  }

  getClient(): DeepstreamClient {
    return this.dsClient;
  }

  doQuery<T = any>(queryDesc: IQueryDesc, start = 0): Observable<T[]> {
    const rpcData: IRpcQuery = { payload: { ...queryDesc } };

<<<<<<< HEAD
    return this.callRpc('open.search-provider.serialize', rpcData).pipe(
=======
    return this.callRpc('open.search-provider.serialize', rpcData)
    .pipe(
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
      switchMap(res => {
        const query = new Query<T>(this.dsClient);
        return this._initLiveQuery(res, query.queryForData(res.name, res.table));
      })
    );
  }

  doPageQuery<T = any>(queryDesc: IQueryDesc, currentPage, pageSize): Observable<T[]> {
    const start = currentPage * pageSize;
    const end = start + pageSize;

    const rpcData: IRpcQuery = {
      payload: {
        ...queryDesc,
        limit: end
      }
    };

<<<<<<< HEAD
    return this.callRpc('open.search-provider.serialize', rpcData).pipe(
      switchMap(res => {
        const query = new Query<T>(this.dsClient);
        return this._initLiveQuery(res, query.pageableQuery(res.name, start, end, res.table));
      })
    );
=======
    return this.callRpc('open.search-provider.serialize', rpcData)
      .pipe(
        switchMap(res => {
          const query = new Query<T>(this.dsClient);
          return this._initLiveQuery(res, query.pageableQuery(res.name, start, end, res.table));
        })
      );
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
  }

  doWindowedQuery<T = any>(queryDesc: IQueryDesc, start, end): Observable<T[]> {
    const rpcData: IRpcQuery = {
      payload: {
        ...queryDesc,
        limit: end
      }
    };

<<<<<<< HEAD
    return this.callRpc('open.search-provider.serialize', rpcData).pipe(
      switchMap(res => {
        const query = new Query<T>(this.dsClient);
        return this._initLiveQuery(res, query.pageableQuery(res.name, start, end, res.table));
      })
    );
=======
    return this.callRpc('open.search-provider.serialize', rpcData)
      .pipe(
        switchMap(res => {
          const query = new Query<T>(this.dsClient);
          return this._initLiveQuery(res, query.pageableQuery(res.name, start, end, res.table));
        })
      );
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
  }

  getRecord<T = any>(id: string): Record<T> {
    return new Record<T>(this.dsClient, id);
  }

  getList<T = any>(id: string): List<T> {
    return new List<T>(this.dsClient, id);
  }

  callRpc<T = any>(name: string, data: any): Observable<T> {
    const rpc = new Rpc(this.dsClient);
<<<<<<< HEAD
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
      })
    );
=======
    const userSelector = this._store
      .pipe(
        select(this._selectors.userData),
        take(1)
      );

    return userSelector
      .pipe(
        switchMap(user => {
          const sentData = {
            ...data,
            userId: user.userId || 'open',
            role: user.role || EAuthRoles.user
          };

          return rpc.make(name, sentData);
        })
      );
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
  }

  listenUserEvents() {
    const userSelector = this._store.pipe(select(this._selectors.userData));
<<<<<<< HEAD
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
=======
    return userSelector.pipe(filter((user: any) => user.role && user.userId), switchMap((user: any) => {
      const topic = `${user.role}/${user.userId}`;
      return new Observable<any>((obs: Observer<any>) => {
        this.dsClient.client.event.subscribe(topic, payload => {
          obs.next(payload);
          return () => this.dsClient.client.event.unsubscribe(topic);
        });
      });
    }), );
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
  }

  @DebugLog
  private _init() {
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
        return this._store.dispatch(new DeepstreamPermissionRecordChanged(permissionRecord));
      });
  }

  private _initLiveQuery<T>(res: any, cb: Observable<T[]>) {
    const runningQuery = this._liveQueries[res.name];
    if (runningQuery) {
      return this._liveQueries[res.name];
    } else {
      const subject = new Subject<T[]>();
      const source = cb;
<<<<<<< HEAD
      const liveQuery = source.pipe(
        multicast(subject),
        refCount()
      );
      this._liveQueries[res.name] = liveQuery;

      return liveQuery.pipe(
=======
      const liveQuery = source.pipe(multicast(subject), refCount());
      this._liveQueries[res.name] = liveQuery;

      return liveQuery
      .pipe(
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
        finalize(() => {
          log.data('Disposing live query', res.name);
          delete this._liveQueries[res.name];
        })
      );
    }
  }
}
