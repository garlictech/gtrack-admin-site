import { DebugLog } from 'app/log';
import { State } from 'app/store/state';
import _cloneDeep from 'lodash-es/cloneDeep';
import _get from 'lodash-es/get';
import { combineLatest as observableCombineLatest, Observable, of as observableOf } from 'rxjs';
import { filter, map, pluck, switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { AuthenticationSelectors, User } from '@features/common/authentication';
import { EAuthRoles, PublicCommonProfile } from '@features/common/gtrack-interfaces/interfaces';
import { createFeatureSelector, createSelector, select, Store } from '@ngrx/store';

import { DecoratedPublicCommonProfile, EProfileGroup } from '../interfaces';
import * as Actions from './actions';
import {
  featureName,
  HikeProgramSettingsState,
  PrivateProfileState,
  PublicProfileState,
  publicProfileStateAdapter,
  SettingsState
} from './state';

const defaultCoverPicture = '/assets/img/defaultcover.jpg';

const selectFeature = createFeatureSelector<SettingsState>(featureName);

const selectPrivateProfileFeature = createSelector(
  selectFeature,
  (state: SettingsState) => state.privateProfile
);

export const selectHikeProgramSettingsFeature = createSelector<object, SettingsState, HikeProgramSettingsState>(
  selectFeature,
  (state: SettingsState) => state.hikeProgramSettings
);

export const getHikeStartDate = createSelector<object, HikeProgramSettingsState, Date>(
  selectHikeProgramSettingsFeature,
  state => state.hikeDate
);

export const getHikeSpeed = createSelector<object, HikeProgramSettingsState, number>(
  selectHikeProgramSettingsFeature,
  state => state.speed
);

export const profileFetchFailure = createSelector(
  selectPrivateProfileFeature,
  (state: PrivateProfileState) => state.fetching.failed
);

export const isFetchingProfile = createSelector(
  selectPrivateProfileFeature,
  (state: PrivateProfileState) => state.fetching.working
);

export const profileGroupSelector = (group: EProfileGroup) =>
  createSelector(
    selectPrivateProfileFeature,
    state => _get(state, `data.profile.${group}`)
  );

export const profileGroupSaveFailure = (group: EProfileGroup) =>
  createSelector(
    selectPrivateProfileFeature,
    (state: PrivateProfileState) => _get(state, `profileGroups.${group}.failed`)
  );

export const profileGroupSaving = (group: EProfileGroup) =>
  createSelector(
    selectPrivateProfileFeature,
    (state: PrivateProfileState) => _get(state, `profileGroups.${group}.working`)
  );

export const selectPrivateProfileInCurrentRole = createSelector(
  selectPrivateProfileFeature,
  state => _get(state, `data.profile`)
);

const publicProfilesSelector = createSelector(
  selectFeature,
  (state: SettingsState) => state.publicProfiles
);

const { selectEntities: selectPublicUserEntities } = publicProfileStateAdapter.getSelectors(publicProfilesSelector);

const selectPublicDataOf = userId =>
  createSelector(
    selectPublicUserEntities,
    entities => entities[userId]
  );

@Injectable()
export class Selectors {
  getMyId;
  getMyRole;
  getMyProfilePicture;
  getMyUserName;
  getMyCoverPicture;
  getMyPublicProfile: Observable<DecoratedPublicCommonProfile>;
  getMyPublicData;

  constructor(protected _store: Store<State>) {
    this.getMyId = this._store.pipe(select(AuthenticationSelectors.selectUserId));
    this.getMyRole = this._store.pipe(select(AuthenticationSelectors.selectRole));

    this.getMyPublicProfile = this._store.pipe(
      select(AuthenticationSelectors.selectUser),
      filter(user => !!user),
      switchMap((user: User) =>
        this.getPublicProfileOf(user.id, user.roles[0] as EAuthRoles).pipe(
          filter(profile => !!profile),
          map(profile => {
            const links = {
              user: ['user']
            };

            profile.profileUrl = `/${links[user.roles[0]]}`;

            return profile;
          })
        )
      )
    );

    this.getMyPublicData = this._store.pipe(
      select(AuthenticationSelectors.selectUser),
      filter(user => !!user),
      switchMap((user: User) => this.getPublicDataOf(user.id, user.roles[0] as EAuthRoles)),
      filter(data => !!data)
    );

    this.getMyProfilePicture = this.getMyPublicProfile.pipe(pluck('profilePicture'));

    this.getMyCoverPicture = this.getMyPublicProfile.pipe(
      pluck('coverPicture'),
      map(picture => picture || defaultCoverPicture)
    );

    this.getMyUserName = this.getMyPublicProfile.pipe(pluck('userName'));
  }

  @DebugLog getPublicProfileOf(userId: string, role: EAuthRoles): Observable<DecoratedPublicCommonProfile> {
    return this.getPublicDataOf(userId, role).pipe(
      switchMap(data => {
        let selectedProfile: DecoratedPublicCommonProfile = _cloneDeep(data);

        if (!selectedProfile) {
          selectedProfile = {
            coverPicture: defaultCoverPicture,
            userName: ''
          };
        } else {
          if (!selectedProfile.coverPicture) {
            selectedProfile.coverPicture = defaultCoverPicture;
          }

          if (!selectedProfile.profilePicture) {
            selectedProfile.profilePicture = '';
          }

          if (!selectedProfile.userName) {
            selectedProfile.userName = 'unknown';
          }
        }

        return observableCombineLatest(
          observableOf(selectedProfile),
          this._store.pipe(select(AuthenticationSelectors.selectRole))
        );
      }),
      map(result => {
        const selectedProfile = result[0];
        const myRole = result[1];

        if (selectedProfile) {
          selectedProfile.profileUrl = `/${myRole}/${role}/${userId}`;
        }

        return selectedProfile;
      })
    );
  }

  @DebugLog getPublicDataOf(userId: string, role: EAuthRoles): Observable<PublicCommonProfile> {
    return this._store.pipe(
      select(selectPublicDataOf(userId)),
      tap(profile => {
        if (!profile) {
          this._store.dispatch(new Actions.PublicProfileFetchStart(userId, role));
        }
      }),
      filter(data => !!data && !data.working),
      pluck<PublicProfileState, PublicCommonProfile>(role)
    );
  }
}
