
import { TestBed } from '@angular/core/testing';
import { hot, cold, Scheduler } from 'jest-marbles';
import { Actions, EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { Observable, EMPTY, of } from 'rxjs';

import { SettingsService } from '../../services';
import * as actions from '../actions';
import { Effects as SettingsEffects } from '../effects';
import { EProfileGroup } from '../../interfaces';
import { EAuthRoles } from 'subrepos/provider-client';

class TestActions extends Actions {
  constructor() {
    super(EMPTY);
  }

  set stream(source: Observable<any>) {
    this.source = source;
  }
}

describe('Settings effects', () => {
  let service: SettingsService;
  let actions$: TestActions;
  let effects: SettingsEffects;

  const privateProfile = {
    profile: {
      basic: {
        userName: 'test'
      },
      settings: {
        messageSound: false
      }
    }
  };

  const publicProfile ={
    user: {
      userName: 'test'
    }
  };

  function getActions() {
    return new TestActions();
  }

  function getService() {
    return {
      get: jasmine.createSpy('get').and.returnValue(of(privateProfile)),
      save: jasmine.createSpy('save').and.returnValue(of(true)),
      getPublicProfile: jasmine.createSpy('getPublicProfile').and.returnValue(of(publicProfile))
    };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({})
      ],
      providers: [
        {
          provide: SettingsService,
          useFactory: getService
        },
        {
          provide: Actions,
          useFactory: getActions
        },
        SettingsEffects
      ]
    });

    actions$ = TestBed.get(Actions);
    effects = TestBed.get(SettingsEffects);

    service = TestBed.get(SettingsService);
  });

  describe('profileFetchStart$', () => {
    it('should fetch the settings', () => {
      const action = new actions.SettingsFetchStart();
      const completion = new actions.SettingsFetchSuccess(privateProfile);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.profileFetchStart$).toBeObservable(expected);
      Scheduler.get().flush();

      expect(service.get).toHaveBeenCalled();
    });
  });

  describe('settingsSave$', () => {
    it('should save the settings', () => {
      const action = new actions.SettingsSaveStart(EProfileGroup.basic, privateProfile.profile.basic);

      const completion = new actions.SettingsSaveSuccess(EProfileGroup.basic);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.settingsSave$).toBeObservable(expected);
      Scheduler.get().flush();

      expect(service.save).toHaveBeenCalledWith(EProfileGroup.basic, privateProfile.profile.basic);
    });
  });

  describe('publicProfileFetchStart$', () => {
    it('should fetcth the public profile', () => {
      const action = new actions.PublicProfileFetchStart('test', EAuthRoles.user);

      const completion = new actions.PublicProfileFetched(publicProfile, 'test');

      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.publicProfileFetchStart$).toBeObservable(expected);
      Scheduler.get().flush();

      expect(service.getPublicProfile).toHaveBeenCalledWith('test');
    });
  });

});
