import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { Observer } from 'rxjs/Observer';
import { Store } from '@ngrx/store';
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
  private dsClient: DeepstreamClient;
  private _liveQueries: { [key: string]: Observable<any[]> } = {};

  constructor(
    @Inject(EXTERNAL_DEEPSTREAM_DEPENDENCIES) private _externals: IExternalDeepstreamDependencies,
    private _selectors: Selectors,
    private _store: Store<any>
  ) {
    this._init();
  }

  login(token: string) {
    return this.dsClient.close().switchMap(() => this.dsClient.login({ jwtToken: token }));
  }

  getClient(): DeepstreamClient {
    return this.dsClient;
  }

  doQuery<T = any>(queryDesc: IQueryDesc, start = 0): Observable<T[]> {
    const rpcData: IRpcQuery = { payload: { ...queryDesc } };

    return this.callRpc('open.search-provider.serialize', rpcData).switchMap(res => {
      const query = new Query<T>(this.dsClient);
      return this._initLiveQuery(res, query.queryForData(res.name, res.table));
    });
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

    return this.callRpc('open.search-provider.serialize', rpcData).switchMap(res => {
      const query = new Query<T>(this.dsClient);
      return this._initLiveQuery(res, query.pageableQuery(res.name, start, end, res.table));
    });
  }

  doWindowedQuery<T = any>(queryDesc: IQueryDesc, start, end): Observable<T[]> {
    const rpcData: IRpcQuery = {
      payload: {
        ...queryDesc,
        limit: end
      }
    };

    return this.callRpc('open.search-provider.serialize', rpcData).switchMap(res => {
      const query = new Query<T>(this.dsClient);
      return this._initLiveQuery(res, query.pageableQuery(res.name, start, end, res.table));
    });
  }

  getRecord<T = any>(id: string): Record<T> {
    return new Record<T>(this.dsClient, id);
  }

  getList<T = any>(id: string): List<T> {
    return new List<T>(this.dsClient, id);
  }

  callRpc<T = any>(name: string, data: any): Observable<T> {
    const rpc = new Rpc(this.dsClient);
    const userSelector = this._store.select(this._selectors.userData).take(1);

    return userSelector.switchMap(user => {
      const sentData = {
        ...data,
        userId: user.userId || 'open',
        role: user.role || EAuthRoles.user
      };

      return rpc.make(name, sentData);
    });
  }

  listenUserEvents() {
    const userSelector = this._store.select(this._selectors.userData);
    return userSelector.filter((user: any) => user.role && user.userId).switchMap((user: any) => {
      const topic = `${user.role}/${user.userId}`;
      return new Observable<any>((obs: Observer<any>) => {
        this.dsClient.client.event.subscribe(topic, payload => {
          obs.next(payload);
          return () => this.dsClient.client.event.unsubscribe(topic);
        });
      });
    });
  }

  static getDeepstreamClient(connectionString: string) {
    return new DeepstreamClient(connectionString);
  }

  @DebugLog
  private _init() {
    this.dsClient = DeepstreamService.getDeepstreamClient(this._externals.deepstreamConnectionString);

    this.dsClient.errors$.subscribe(error => {
      log.error('Deepstream error: ', error);
    });

    this._store
      .select(this._selectors.permissionRecordName)
      .filter(recordName => !!recordName)
      .switchMap(recordName => {
        const record = this.getRecord(recordName);
        return record.get();
      })
      .catch((err, caught) => {
        log.error('Deepstream permission record error', err);
        return caught;
      })
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
      const query = new Query<T>(this.dsClient);
      const source = cb;
      const liveQuery = source.multicast(subject).refCount();
      this._liveQueries[res.name] = liveQuery;

      return liveQuery.finally(() => {
        log.data('Disposing live query', res.name);
        delete this._liveQueries[res.name];
      });
    }
  }
}
