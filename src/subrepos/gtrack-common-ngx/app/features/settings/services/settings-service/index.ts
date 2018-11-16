import * as fromGenericUiActions from '@common.features/generic-ui/store/actions';
import { AuthenticationSelectors, User } from 'subrepos/gtrack-common-ngx';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { DebugLog, log } from 'app/log';
import { DeepstreamService } from 'subrepos/gtrack-common-ngx/app/deepstream';
import { EProfileGroup } from '@common.features/settings/interfaces';
import { EToastSeverity } from '@common.features/generic-ui';
import { ICommonProfile, ICommonProfileSettings, IUserData } from 'subrepos/provider-client/interfaces';
import { Injectable } from '@angular/core';
import { IPublicProfile } from 'subrepos/provider-client/interfaces';
import { LANGUAGES } from 'subrepos/provider-client/user-profile/constants';
import { Observable, throwError } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { State } from 'app/store/state';

export const languages = LANGUAGES.map(val => {
  return { label: `${val.nativeName}(${val.name})`, value: val.code };
});

@Injectable()
export class SettingsService {
  constructor(
    private _deepstream: DeepstreamService,
    private _authSelectors: AuthenticationSelectors.Selectors,
    private _store: Store<State>
  ) {}

  @DebugLog
  get(): Observable<IUserData> {
    return this._store.pipe(
      select(this._authSelectors.user),
      filter(user => !!user && !!user.roles),
      switchMap((user: User) => this._deepstream.getRecord(`private_user_profile/${user.id}`).get(user.roles[0]))
    );
  }

  @DebugLog
  save(profileGroup: EProfileGroup, data: ICommonProfile | ICommonProfileSettings): Observable<boolean> {
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

  @DebugLog
  getPublicProfile(userId: string): Observable<IPublicProfile> {
    return this._deepstream
      .getRecord(`public_user_profile/${userId}`)
      .get()
      .pipe(
        catchError((err, x) => {
          log.error('Temporary failure in profile fetch', err);
          return x;
        }),
        map(user => {
          return { ...user, id: userId };
        })
      );
  }
}
