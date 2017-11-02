import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Client as DeepstreamClient, Record, Query, Rpc, List } from '@garlictech/deepstream-rxjs';

import { EXTERNAL_DEEPSTREAM_DEPENDENCIES, IExternalDeepstreamDependencies } from '../lib/externals';

import { log } from '../log';

@Injectable()
export class DeepstreamService {
  private dsClient: DeepstreamClient;
  constructor(@Inject(EXTERNAL_DEEPSTREAM_DEPENDENCIES) private _externals: IExternalDeepstreamDependencies) {
    this.dsClient = DeepstreamService.getDeepstreamClient(this._externals.deepstreamConnectionString);
    this.dsClient.errors$.subscribe(error => {
      log.er('Deepstream error: ', error);
    });
    // open login first
    this.dsClient.login(null);
  }
  login(token: string) {
    return this.dsClient.close().switchMap(() => this.dsClient.login({ jwtToken: token }));
  }
  getClient(): DeepstreamClient {
    return this.dsClient;
  }
  doQuery<T = any>(queryObject: any, start = 0): Observable<T[]> {
    let rpc = new Rpc(this.dsClient);
    return rpc.make('camnjoy.search-provider.serialize', { payload: queryObject }).switchMap(res => {
      let query = new Query<T>(this.dsClient);
      return query.queryForData(res.name, res.table);
    });
  }
  doPageQuery<T = any>(queryObject: any, currentPage, pageSize): Observable<T[]> {
    let start = currentPage * pageSize;
    let end = start + pageSize;
    queryObject.limit = end;
    let rpc = new Rpc(this.dsClient);
    return rpc.make('camnjoy.search-provider.serialize', { payload: queryObject }).switchMap(res => {
      let query = new Query<T>(this.dsClient);
      return query.pageableQuery(res.name, start, end, res.table);
    });
  }
  getRecord<T = any>(id: string): Record<T> {
    return new Record<T>(this.dsClient, id);
  }
  getList<T = any>(id: string): List<T> {
    return new List<T>(this.dsClient, id);
  }
  callRpc(name: string, data: any): Observable<any> {
    let rpc = new Rpc(this.dsClient);
    return rpc.make(name, data);
  }
  static getDeepstreamClient(connectionString: string) {
    return new DeepstreamClient(connectionString);
  }
}
