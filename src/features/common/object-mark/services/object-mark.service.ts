import { Observable } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { AuthenticationSelectors } from '@bit/garlictech.angular-features.common.authentication';
import { DeepstreamService } from '@bit/garlictech.angular-features.common.deepstream-ngx';
import { EObjectMarkContext, ObjectMark } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { select, Store } from '@ngrx/store';

import { DebugLog, log } from '../log';

@Injectable()
export class ObjectMarkService {
  constructor(
    private readonly _deepstream: DeepstreamService,
    private readonly _authSelectors: AuthenticationSelectors.Selectors,
    private readonly _store: Store<any>
  ) {}

  @DebugLog loadContext(context: EObjectMarkContext): Observable<any> {
    return this._store.pipe(
      select(this._authSelectors.user),
      filter(user => !!user && !!user.roles),
      tap(user => log.data('Get record: ', `private_user_profile/${user.id}`, `markedObjects.${context}`)),
      switchMap(user =>
        this._deepstream.getRecord<Array<any>>(`private_user_profile/${user.id}`).get(`markedObjects.${context}`)
      ),
      tap(result => log.data('Context result: ', result))
    );
  }

  @DebugLog mark(context: EObjectMarkContext, object: any, mark: boolean): Observable<any> {
    const data: ObjectMark = {
      context,
      object,
      mark
    };

    log.data('Object mark data: ', data);

    return this._deepstream.callRpc('object-mark', data);
  }
}
