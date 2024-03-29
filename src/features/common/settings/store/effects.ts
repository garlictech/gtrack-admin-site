import _get from 'lodash-es/get';
// tslint:disable:no-property-initializers
import { Observable, of as observableOf } from 'rxjs';
import { catchError, delay, map, mergeMap, retryWhen, switchMap, take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { UserData } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { log } from '../log';
import { SettingsService } from '../services';
import * as LocalActions from './actions';
import { defaultSettings } from './state';

@Injectable()
export class Effects {
  @Effect() profileFetchStart$: Observable<Action> = this._actions$.pipe(
    ofType(LocalActions.SETTINGS_FETCH_START),
    switchMap(() => {
      log.data(`Effect: Profile fetch start initiated`);

      return this._profileService.get().pipe(
        retryWhen(error => {
          this._store.dispatch(new LocalActions.SettingsFetchFailure(error));

          return observableOf(error).pipe(delay(1000));
        }),
        map(settings => {
          log.data(`Effect: new settings data arrived:`, settings);

          let settingsToStore: UserData = {
            profile: { settings: { ...defaultSettings }, basic: {} as any }
          };

          if (settings) {
            settingsToStore = { ...settings };
          }

          if (!_get(settingsToStore, 'profile.settings')) {
            settingsToStore.profile.settings = { ...defaultSettings };
          }

          return new LocalActions.SettingsFetchSuccess(settingsToStore);
        })
      );
    })
  );

  @Effect() settingsSave$: Observable<Action> = this._actions$.pipe(
    ofType(LocalActions.SETTINGS_SAVE_START),
    mergeMap((action: LocalActions.SettingsSaveStart) => {
      log.data(`Effect: Settings save initiated for group ${action.profileGroup}`);

      return this._profileService.save(action.profileGroup, action.data).pipe(
        take(1),
        map(settings => {
          log.info(`Effect: Settings save success for ${action.profileGroup}`);

          return new LocalActions.SettingsSaveSuccess(action.profileGroup);
        }),
        catchError(error => {
          log.error(`Effect: Settings save error for ${action.profileGroup}`, error);

          return observableOf(new LocalActions.SettingsSaveFailure(error, action.profileGroup));
        })
      );
    })
  );

  @Effect() publicProfileFetchStart$: Observable<Action> = this._actions$.pipe(
    ofType(LocalActions.PUBLIC_PROFILE_FETCH_START),
    mergeMap((action: LocalActions.PublicProfileFetchStart) => {
      log.data(`Effect: Public profile fetch start initiated`);

      return this._profileService.getPublicProfile(action.id).pipe(
        map(settings => {
          log.data(`Effect: new public profile data arrived:`, settings);

          return new LocalActions.PublicProfileFetched(settings, action.id);
        })
      );
    }, 20)
  );

  constructor(
    private readonly _actions$: Actions,
    private readonly _profileService: SettingsService,
    private readonly _store: Store<any>
  ) {
    log.data('Initializing settings/settings effects...');
  }
}
