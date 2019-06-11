import { Observable, throwError } from 'rxjs';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { User } from '@bit/garlictech.angular-features.common.authentication';
import { Selectors as AuthenticationSelectors } from '@bit/garlictech.angular-features.common.authentication/store/selectors';
import { DeepstreamService } from '@bit/garlictech.angular-features.common.deepstream-ngx';
import { EToastSeverity } from '@bit/garlictech.angular-features.common.generic-ui';
import * as fromGenericUiActions from '@bit/garlictech.angular-features.common.generic-ui/store/actions';
import {
  CommonProfile,
  CommonProfileSettings,
  PublicProfile,
  UserData
} from '@bit/garlictech.angular-features.common.gtrack-interfaces/interfaces';
import { LANGUAGES } from '@bit/garlictech.angular-features.common.gtrack-interfaces/user-profile/constants';
import { select, Store } from '@ngrx/store';

import { EProfileGroup } from '../../interfaces';
import { DebugLog, log } from '../../log';

export const languages = LANGUAGES.map(val => ({ label: `${val.nativeName}(${val.name})`, value: val.code }));

@Injectable()
export class SettingsService {
  constructor(
    private readonly _deepstream: DeepstreamService,
    private readonly _authSelectors: AuthenticationSelectors,
    private readonly _store: Store<any>
  ) {}

  @DebugLog get(): Observable<UserData> {
    return this._store.pipe(
      select(this._authSelectors.user),
      filter(user => !!user && !!user.roles),
      switchMap((user: User) => this._deepstream.getRecord(`private_user_profile/${user.id}`).get(user.roles[0]))
    );
  }

  @DebugLog save(profileGroup: EProfileGroup, data: CommonProfile | CommonProfileSettings): Observable<boolean> {
    const executeProperProvider = () => {
      switch (profileGroup) {
        case EProfileGroup.basic:
          return this._store.pipe(
            select(this._authSelectors.role),
            take(1),
            switchMap(role => this._deepstream.callRpc(`${role}.update-basic-info`, data))
          );
        case EProfileGroup.settings:
          return this._store.pipe(
            select(this._authSelectors.role),
            take(1),
            switchMap(role => this._deepstream.callRpc(`${role}.update-settings`, data))
          );
        default:
          return throwError('Invalid provider');
      }
    };

    return executeProperProvider().pipe(
      tap(
        () =>
          this._store.dispatch(
            new fromGenericUiActions.DisplayToast({
              summary: 'Settings saved'
            })
          ),
        () =>
          this._store.dispatch(
            new fromGenericUiActions.DisplayToast({
              summary: 'Cannot save settings',
              severity: EToastSeverity.Error
            })
          )
      )
    );
  }

  @DebugLog getPublicProfile(userId: string): Observable<PublicProfile> {
    return this._deepstream
      .getRecord(`public_user_profile/${userId}`)
      .get()
      .pipe(
        catchError((err, x) => {
          log.error('Temporary failure in profile fetch', err);

          return x;
        }),
        map(user => ({ ...user, id: userId }))
      );
  }
}
