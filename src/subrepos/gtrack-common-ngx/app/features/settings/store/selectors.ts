import { of as observableOf, combineLatest as observableCombineLatest, Observable } from 'rxjs';

import { tap, filter, switchMap, map, pluck } from 'rxjs/operators';
import { EAuthRoles, IPublicCommonProfile } from 'subrepos/provider-client/interfaces';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import _get from 'lodash-es/get';
import _cloneDeep from 'lodash-es/cloneDeep';

import { AuthenticationSelectors, User } from 'subrepos/gtrack-common-ngx/app/authentication';
import { State } from 'app/store/state';
import { DebugLog } from 'app/log';

import { IPublicProfileState } from './state';

import {
  publicProfileStateAdapter,
  IPrivateProfileState,
  ISettingsState,
  IHikeProgramSettingsState,
  featureName
} from './state';

import { EProfileGroup, IDecoratedPublicCommonProfile } from '../interfaces';
import * as Actions from './actions';

const defaultCoverPicture = '/assets/img/defaultcover.jpg';

const selectFeature = createFeatureSelector<ISettingsState>(featureName);

const selectPrivateProfileFeature = createSelector(
  selectFeature,
  (state: ISettingsState) => state.privateProfile
);

export const selectHikeProgramSettingsFeature = createSelector<
  object,
  ISettingsState,
  IHikeProgramSettingsState
>(selectFeature, (state: ISettingsState) => state.hikeProgramSettings);

export const getHikeStartDate = createSelector<object, IHikeProgramSettingsState, Date>(
  selectHikeProgramSettingsFeature,
  state => state.hikeDate
);

export const getHikeSpeed = createSelector<object, IHikeProgramSettingsState, number>(
  selectHikeProgramSettingsFeature,
  state => state.speed
);

export const profileFetchFailure = createSelector(
  selectPrivateProfileFeature,
  (state: IPrivateProfileState) => state.fetching.failed
);

export const isFetchingProfile = createSelector(
  selectPrivateProfileFeature,
  (state: IPrivateProfileState) => state.fetching.working
);

export const profileGroupSelector = (group: EProfileGroup) =>
  createSelector(selectPrivateProfileFeature, state => _get(state, `data.profile.${group}`));

export const profileGroupSaveFailure = (group: EProfileGroup) =>
  createSelector(selectPrivateProfileFeature, (state: IPrivateProfileState) =>
    _get(state, `profileGroups.${group}.failed`)
  );

export const profileGroupSaving = (group: EProfileGroup) =>
  createSelector(selectPrivateProfileFeature, (state: IPrivateProfileState) =>
    _get(state, `profileGroups.${group}.working`)
  );

export const selectPrivateProfileInCurrentRole = createSelector(
  selectPrivateProfileFeature,
  state => _get(state, `data.profile`)
);

const publicProfilesSelector = createSelector(
  selectFeature,
  (state: ISettingsState) => state.publicProfiles
);

const { selectEntities: selectPublicUserEntities } = publicProfileStateAdapter.getSelectors(
  publicProfilesSelector
);

const selectPublicDataOf = userId =>
  createSelector(selectPublicUserEntities, entities => entities[userId]);

@Injectable()
export class Selectors {
  getMyId;
  getMyRole;
  getMyProfilePicture;
  getMyUserName;
  getMyCoverPicture;
  getMyPublicProfile: Observable<IDecoratedPublicCommonProfile>;
  getMyPublicData;

  constructor(protected _store: Store<State>) {
    this.getMyId = this._store.pipe(select(AuthenticationSelectors.selectUserId));
    this.getMyRole = this._store.pipe(select(AuthenticationSelectors.selectRole));

    this.getMyPublicProfile = this._store.pipe(
      select(AuthenticationSelectors.selectUser),
      filter(user => !!user),
      switchMap((user: User) =>
        this.getPublicProfileOf(user.id, <EAuthRoles>user.roles[0]).pipe(
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
      switchMap((user: User) => this.getPublicDataOf(user.id, <EAuthRoles>user.roles[0])),
      filter(data => !!data)
    );

    this.getMyProfilePicture = this.getMyPublicProfile.pipe(pluck('profilePicture'));

    this.getMyCoverPicture = this.getMyPublicProfile.pipe(
      pluck('coverPicture'),
      map(picture => picture || defaultCoverPicture)
    );

    this.getMyUserName = this.getMyPublicProfile.pipe(pluck('userName'));
  }

  @DebugLog
  getPublicProfileOf(userId: string, role: EAuthRoles) {
    return this.getPublicDataOf(userId, role).pipe(
      switchMap(data => {
        let selectedProfile: IDecoratedPublicCommonProfile = _cloneDeep(data);

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

  @DebugLog
  getPublicDataOf(userId: string, role: EAuthRoles) {
    return this._store.pipe(
      select(selectPublicDataOf(userId)),
      tap(profile => {
        if (!profile) {
          this._store.dispatch(new Actions.PublicProfileFetchStart(userId, role));
        }
      }),
      filter(data => !!data && !data.working),
      pluck<IPublicProfileState, IPublicCommonProfile>(role)
    );
  }
}
