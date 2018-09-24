import { TestBed } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import { of } from 'rxjs';

import { EAuthRoles, EObjectMarkContext } from 'subrepos/provider-client';
import { ObjectMarkService } from '../object-mark.service';
import { DeepstreamService } from '../../../../../deepstream-ngx';
import { AuthenticationSelectors } from '../../../authentication/store';

describe('ObjectMarkService', () => {
  let store: Store<any>;

  let fakeService;
  let getRecordSpy: jasmine.Spy;
  let getSpy: jasmine.Spy;
  let callRpcSpy: jasmine.Spy;

  beforeEach(() => {
    getSpy = jasmine.createSpy('get').and.returnValue(of(['foo']));

    const fakeRecord = {
      get: getSpy
    };

    callRpcSpy = jasmine.createSpy('callRpc').and.returnValue(of({ success: true }));
    getRecordSpy = jasmine.createSpy('getRecord').and.returnValue(fakeRecord);

    fakeService = {
      callRpc: callRpcSpy,
      getRecord: getRecordSpy
    };

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [
        ObjectMarkService,
        {
          provide: DeepstreamService,
          useValue: fakeService
        },
        {
          provide: AuthenticationSelectors.Selectors,
          useValue: {
            user: null
          }
        }
      ]
    });

    store = TestBed.get(Store);
    spyOn(store, 'select').and.returnValue(
      of({
        roles: [EAuthRoles.user],
        id: 'foo'
      })
    );
  });

  xit('should get the context from deepstream', async () => {
    const service: ObjectMarkService = TestBed.get(ObjectMarkService);
    const data = await service.loadContext(EObjectMarkContext.bookmarkedHike).toPromise();

    expect(getRecordSpy).toHaveBeenCalledWith('private_user_profile/foo');
    expect(getSpy).toHaveBeenCalledWith(`markedObjects.${EObjectMarkContext.bookmarkedHike}`);

    expect(data).toEqual(['foo']);
  });

  it('should mark an object', async () => {
    const service: ObjectMarkService = TestBed.get(ObjectMarkService);
    const response = await service.mark(EObjectMarkContext.bookmarkedHike, 'foo', true).toPromise();

    expect(callRpcSpy).toHaveBeenCalledWith('object-mark', {
      context: EObjectMarkContext.bookmarkedHike,
      mark: true,
      object: 'foo'
    });

    expect(response).toEqual({
      success: true
    });
  });
});
