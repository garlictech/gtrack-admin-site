import _get from 'lodash-es/get';
import { Observable, Observer, Subject } from 'rxjs';
import { filter, finalize, map, multicast, refCount, switchMap, take } from 'rxjs/operators';

import { Inject, Injectable } from '@angular/core';
import { EAuthRoles } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { Client as DeepstreamClient, IClientData, List, Query, Record, Rpc } from '@garlictech/deepstream-rxjs';
import { select, Store } from '@ngrx/store';

import { EXTERNAL_DEEPSTREAM_DEPENDENCIES, ExternalDeepstreamDependencies } from '../lib/externals';
import { DebugLog, log } from '../log';
import { Selectors } from '../store/selectors';
import { FakeRecord } from './fake-record';

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
  private readonly dsClient: DeepstreamClient;
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

  login(token: string): Observable<IClientData> {
    return this.dsClient.close().pipe(switchMap(() => this.dsClient.login({ jwtToken: token })));
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
    return new FakeRecord<T>(this._externals.deepstreamConnectionString, id);
  }

  getList<T = any>(id: string): List<T> {
    return new List<T>(this.dsClient, id);
  }

  callRpc<T = any>(name: string, data: any, callTimeout = 3000, delayTime = 1000, retry = 3): Observable<T> {
    const dsClient = DeepstreamService.getDeepstreamClient(this._externals.deepstreamConnectionString);
    const rpc = new Rpc(dsClient);
    const sentData = {
      ...data,
      userId: 'open',
      role: EAuthRoles.user
    };

    return dsClient
      .login({
        jwtToken: undefined
      })
      .pipe(
        switchMap(() => rpc.make(name, sentData)),
        take(1),
        map(rpcResponse => {
          dsClient.close().subscribe();

          return rpcResponse;
        })
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
    // Do nothing
  }

  private _initLiveQuery<T>(res: any, cb: Observable<Array<T>>): Observable<Array<any>> {
    const runningQuery = this._liveQueries[res.name];
    if (runningQuery) {
      return this._liveQueries[res.name];
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
