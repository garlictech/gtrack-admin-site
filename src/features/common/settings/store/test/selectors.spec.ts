import { Subject } from 'rxjs';
import { scan, takeUntil, tap } from 'rxjs/operators';

import { TestBed } from '@angular/core/testing';
import { reducer as authenticationReducer } from '@bit/garlictech.angular-features.common.authentication/store/reducer';
import { featureName as authenticationFeatureName } from '@bit/garlictech.angular-features.common.authentication/store/state';
import { EAuthRoles } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { select, Store, StoreModule } from '@ngrx/store';

import { EProfileGroup } from '../../interfaces';
import * as actions from '../actions';
import { reducer } from '../reducer';
import * as fromSelectors from '../selectors';
import { featureName, SettingsState } from '../state';
import {
  createState,
  initialHikeProgramSettingsState,
  initialPrivateProfileState,
  initialPublicProfileState
} from './utils';

describe('Settings selectors', () => {
  let store: Store<SettingsState>;
  let selectors: fromSelectors.SettingsSelectors;
  let destroy$: Subject<boolean>;

  beforeEach(() => {
    const initialState = createState();

    const reducers: any = {};
    reducers[featureName] = reducer;
    reducers[authenticationFeatureName] = authenticationReducer;

    destroy$ = new Subject<boolean>();

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducers, {
          initialState
        })
      ],
      providers: [fromSelectors.SettingsSelectors]
    });

    store = TestBed.get(Store);
    selectors = TestBed.get(fromSelectors.SettingsSelectors);
  });

  afterEach(() => {
    destroy$.next(true);
    destroy$.unsubscribe();
  });

  describe('hikeProgramSettings', () => {
    describe('selectHikeProgramSettingsFeature', () => {
      it('should return the hikeProgramSettings', () => {
        let result;

        store
          .pipe(
            select(fromSelectors.selectHikeProgramSettingsFeature),
            takeUntil(destroy$)
          )
          .subscribe(feature => (result = feature));

        expect(result).toEqual(initialHikeProgramSettingsState);
      });
    });

    describe('getHikeSpeed', () => {
      it('should return the speed', () => {
        let result;

        store
          .pipe(
            select(fromSelectors.getHikeSpeed),
            takeUntil(destroy$)
          )
          .subscribe(speed => (result = speed));

        expect(result).toEqual(initialHikeProgramSettingsState.speed);
      });
    });

    describe('getHikeStartDate', () => {
      it('should return the hike start date', () => {
        let result: Date;

        store
          .pipe(
            select(fromSelectors.getHikeStartDate),
            takeUntil(destroy$)
          )
          .subscribe(date => (result = date));

        expect(result.getTime()).toEqual(initialHikeProgramSettingsState.hikeDate.getTime());
      });
    });
  });

  describe('Private profile', () => {
    describe('profileFetchFailure', () => {
      it('should return the profile fetch error', () => {
        let result;

        store
          .pipe(
            select(fromSelectors.profileFetchFailure),
            takeUntil(destroy$)
          )
          .subscribe(feature => (result = feature));

        expect(result).toEqual(null);

        store.dispatch(new actions.SettingsFetchFailure({ errorMsg: 'Test error' }));

        expect(result).toEqual({
          errorMsg: 'Test error'
        });
      });
    });

    describe('isFetchingProfile', () => {
      it('should return the profile fetch state', () => {
        let result;

        store
          .pipe(
            select(fromSelectors.isFetchingProfile),
            takeUntil(destroy$)
          )
          .subscribe(feature => (result = feature));

        expect(result).toEqual(false);

        store.dispatch(new actions.SettingsFetchStart());
        expect(result).toEqual(true);

        store.dispatch(new actions.SettingsFetchSuccess(initialPrivateProfileState.data));
        expect(result).toEqual(false);
      });
    });

    describe('profileGroupSelector', () => {
      it('should return the basic group', () => {
        let result;

        store
          .pipe(
            select(fromSelectors.profileGroupSelector(EProfileGroup.basic)),
            takeUntil(destroy$)
          )
          .subscribe(group => (result = group));

        expect(result).toEqual(initialPrivateProfileState.data.profile.basic);
      });

      it('should return the settings group', () => {
        let result;

        store
          .pipe(
            select(fromSelectors.profileGroupSelector(EProfileGroup.settings)),
            takeUntil(destroy$)
          )
          .subscribe(group => (result = group));

        expect(result).toEqual(initialPrivateProfileState.data.profile.settings);
      });
    });

    describe('profileGroupSaveFailure', () => {
      it('should return the profile group save error', () => {
        let result;

        store
          .pipe(
            select(fromSelectors.profileGroupSaveFailure(EProfileGroup.basic)),
            takeUntil(destroy$)
          )
          .subscribe(feature => (result = feature));

        expect(result).toEqual(undefined);

        store.dispatch(new actions.SettingsSaveFailure({ errorMsg: 'Test error' }, EProfileGroup.basic));

        expect(result).toEqual({
          errorMsg: 'Test error'
        });
      });
    });

    describe('profileGroupSaving', () => {
      it('should return the profile group save state', () => {
        let result;

        store
          .pipe(
            select(fromSelectors.profileGroupSaving(EProfileGroup.basic)),
            takeUntil(destroy$)
          )
          .subscribe(feature => (result = feature));

        expect(result).toEqual(undefined);

        store.dispatch(
          new actions.SettingsSaveStart(EProfileGroup.basic, initialPrivateProfileState.data.profile.basic)
        );
        expect(result).toEqual(true);

        store.dispatch(new actions.SettingsSaveSuccess(EProfileGroup.basic));
        expect(result).toEqual(false);
      });
    });

    describe('selectPrivateProfileInCurrentRole', () => {
      it('should return the profile', () => {
        let result;

        store
          .pipe(
            select(fromSelectors.selectPrivateProfileInCurrentRole),
            takeUntil(destroy$)
          )
          .subscribe(feature => (result = feature));

        expect(result).toEqual(initialPrivateProfileState.data.profile);
      });

      it('should not emit a value when only the context changed', () => {
        let result;

        store
          .pipe(
            select(fromSelectors.selectPrivateProfileInCurrentRole),
            tap(console.log),
            scan(acc => acc + 1, 0),
            takeUntil(destroy$)
          )
          .subscribe(feature => (result = feature));

        store.dispatch(new actions.SettingsFetchStart());
        expect(result).toEqual(1);
      });
    });

    describe('getMyPublicProfile', () => {
      it('should return my public profile', () => {
        let result;

        selectors.getMyPublicProfile.subscribe(profile => (result = profile));

        expect(result).toEqual(jasmine.objectContaining(initialPublicProfileState.entities.test.user));
      });
    });

    describe('getPublicProfileOf', () => {
      it("should return the user's public profile", () => {
        let result;

        selectors.getPublicProfileOf('test', EAuthRoles.user).subscribe(profile => (result = profile));

        expect(result).toEqual(jasmine.objectContaining(initialPublicProfileState.entities.test.user));
      });
    });

    describe('getMyPublicData', () => {
      it('should return my public data', () => {
        let result;

        selectors.getMyPublicData.subscribe(data => (result = data));

        expect(result).toEqual(initialPublicProfileState.entities.test.user);
      });
    });

    describe('getPublicDataOf', () => {
      it("should return the user's public data", () => {
        let result;

        selectors.getPublicDataOf('test', EAuthRoles.user).subscribe(data => (result = data));

        expect(result).toEqual(initialPublicProfileState.entities.test.user);
      });
    });
  });
});
