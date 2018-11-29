import { TestBed, async } from '@angular/core/testing';
import { of, throwError, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { EProfileGroup } from '@common.features/settings/interfaces';
import { ICommonProfile, ICommonProfileSettings } from 'subrepos/provider-client/interfaces';
import * as fromGenericUiActions from '@common.features/generic-ui/store/actions';
import { EToastSeverity } from '@common.features/generic-ui';
import { log } from 'app/log';

import { StoreModule, Store } from '@ngrx/store';
import { AuthenticationSelectors, User } from 'subrepos/gtrack-common-ngx';
import { DeepstreamService } from 'subrepos/gtrack-common-ngx/app/deepstream';

import { SettingsService } from '../index';

describe('SettingsService', () => {
  let service: SettingsService;
  let getSpy: jasmine.Spy;
  let getRecordSpy: jasmine.Spy;
  let callSpy: jasmine.Spy;
  let store: Store<any>;
  let testRecord: any;

  const testProfile: ICommonProfile = {
    userName: 'test'
  };

  const testSettings: ICommonProfileSettings = {
    messageSound: true
  };

  beforeEach(() => {
    getSpy = jasmine.createSpy('get').and.returnValue(of({
      test: true
    }));

    testRecord = {
      get: getSpy
    };

    getRecordSpy = jasmine.createSpy('getRecord').and.returnValue(testRecord);

    callSpy = jasmine.createSpy('callRpc').and.returnValue(of({
      success: true
    }));

    const deepstream = {
      getRecord: getRecordSpy,
      callRpc: callSpy
    };

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({})
      ],
      providers: [
        SettingsService,
        {
          provide: AuthenticationSelectors.Selectors,
          useFactory: () => ({
            user: () => ({
              id: 'testid',
              roles: ['testRole']
            }),
            role: () => 'testRole'
          })
        },
        {
          provide: DeepstreamService,
          useFactory: () => deepstream
        }
      ]
    });

    service = TestBed.get(SettingsService);
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    spyOn(log, 'error').and.callThrough();
  });

  it('should get the settings from deepstream', async(() => {
    service
      .get()
      .pipe(
        take(1)
      )
      .subscribe(settings => {
        expect(settings).toEqual({
          test: true
        });

        expect(getRecordSpy).toHaveBeenCalledWith('private_user_profile/testid');
        expect(getSpy).toHaveBeenCalledWith('testRole');
      });
  }));

  it('should get a public profile of a user from deepstream', async(() => {
    service
      .getPublicProfile('testId')
      .pipe(
        take(1)
      )
      .subscribe(settings => {
        expect(settings).toEqual({
          id: 'testId',
          test: true
        });

        expect(getRecordSpy).toHaveBeenCalledWith('public_user_profile/testId');
        expect(getSpy).toHaveBeenCalledWith();
      });
  }));

  it('should handle errors when getting a public profile from deepstream', async(() => {
    let called = false;

    getSpy = jasmine.createSpy('get').and.returnValue(Observable.create(observer => {
      // When called first time throw an error
      if (called === false) {
        called = true;
        observer.error('Test');
      }

      // Return the default
      observer.next({
        test: true
      });
    }));

    testRecord.get = getSpy;

    service
      .getPublicProfile('testId')
      .pipe(
        take(1)
      )
      .subscribe(settings => {
        expect(settings).toEqual({
          id: 'testId',
          test: true
        });

        expect(getRecordSpy).toHaveBeenCalledWith('public_user_profile/testId');
        expect(getSpy).toHaveBeenCalledWith();
        expect(log.error).toHaveBeenCalled();
      });
  }));

  it('should save the basic profile data to deepstream', async(() => {
    service
      .save(EProfileGroup.basic, testProfile)
      .pipe(
        take(1)
      )
      .subscribe(result => {
        expect(result).toEqual({
          success: true
        });

        expect(callSpy).toHaveBeenCalledWith('testRole.update-basic-info', testProfile);
        expect(store.dispatch).toHaveBeenCalledWith({
          type: fromGenericUiActions.ActionTypes.DisplayToast,
          notification: {
            summary: 'Settings saved'
          }
        });
      });
  }));

  it('should fail with invalid group', done => {
    service
      .save('invalid' as EProfileGroup, testProfile)
      .pipe(
        take(1)
      )
      .subscribe(() => done.fail('Not failed'), err => {
        expect(err).toEqual('Invalid provider');
        expect(callSpy).not.toHaveBeenCalled();
        expect(store.dispatch).toHaveBeenCalledWith({
          type: fromGenericUiActions.ActionTypes.DisplayToast,
          notification: {
            summary: 'Cannot save settings',
            severity: EToastSeverity.Error
          }
        });
        done();
      });
  });

  it('should save the profile settings to deepstream', async(() => {
    service
      .save(EProfileGroup.settings, testSettings)
      .pipe(
        take(1)
      )
      .subscribe(result => {
        expect(result).toEqual({
          success: true
        });

        expect(callSpy).toHaveBeenCalledWith('testRole.update-settings', testSettings);
        expect(store.dispatch).toHaveBeenCalledWith({
          type: fromGenericUiActions.ActionTypes.DisplayToast,
          notification: {
            summary: 'Settings saved'
          }
        });
      });
  }));
});
