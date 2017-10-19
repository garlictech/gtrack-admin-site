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
  doQuery(queryObject: any, start = 0): Observable<any> {
    let query = new Query(this.dsClient);
    return query.queryForData(queryObject);
  }
  doPageQuery(queryObject: any, currentPage, pageSize): Observable<any> {
    let start = currentPage * pageSize;
    let end = start + pageSize;
    queryObject.limit = end;
    let query = new Query(this.dsClient);
    return query.pageableQuery(queryObject, start, end);
  }
  getRecord(id: string): Record {
    return new Record(this.dsClient, id);
  }
  getList(id: string): List {
    return new List(this.dsClient, id);
  }
  callRpc(name: string, data: any): Observable<any> {
    let rpc = new Rpc(this.dsClient);
    return rpc.make(name, data);
  }
  static getDeepstreamClient(connectionString: string) {
    return new DeepstreamClient(connectionString);
  }
}
