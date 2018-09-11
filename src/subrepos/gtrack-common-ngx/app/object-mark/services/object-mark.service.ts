import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from 'app/store/state';

import { switchMap, filter, tap } from 'rxjs/operators';

import { EObjectMarkContext, IObjectMark } from 'subrepos/provider-client';

import { DeepstreamService } from '../../../../deepstream-ngx';
import { AuthenticationSelectors } from '../../authentication/store';

import { log, DebugLog } from 'app/log';

@Injectable()
export class ObjectMarkService {
  constructor(
    private _deepstream: DeepstreamService,
    private _authSelectors: AuthenticationSelectors.Selectors,
    private _store: Store<State>
  ) {}

  @DebugLog
  public loadContext(context: EObjectMarkContext) {
    return this._store.select(this._authSelectors.user).pipe(
      filter(user => !!user && !!user.roles),
      tap(user => log.data('Get record: ', `private_user_profile/${user.id}`, `markedObjects.${context}`)),
      switchMap(user =>
        this._deepstream.getRecord<any[]>(`private_user_profile/${user.id}`).get(`markedObjects.${context}`)
      ),
      tap(result => log.data('Context result: ', result))
    );
  }

  @DebugLog
  public mark(context: EObjectMarkContext, object: any, mark: boolean) {
    const data: IObjectMark = {
      context: context,
      object: object,
      mark: mark
    };

    log.data('Object mark data: ', data);

    return this._deepstream.callRpc('object-mark', data);
  }
}
