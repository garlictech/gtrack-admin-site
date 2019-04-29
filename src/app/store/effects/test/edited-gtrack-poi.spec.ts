import { cold, hot, Scheduler } from 'jest-marbles';
import * as _ from 'lodash';
import { Observable, of } from 'rxjs';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { DeepstreamModule, DeepstreamService } from '@bit/garlictech.angular-features.common.deepstream-ngx';
import { PoiService } from '@features/common/poi';
import { Actions, EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { StoreModule } from '@ngrx/store';

import { ExternalPoi } from '../../../shared/interfaces';
import * as editedGTrackPoiSelectors from '../../../store/selectors/edited-gtrack-poi';
import { editedGTrackPoiActions } from '../../actions';
import { pois as poiFixtures } from '../../reducer/test/fixtures';
import { EditedGTrackPoiEffects } from '../edited-gtrack-poi';
import { mockRouter } from './helpers';

describe('EditedGTrackPoiEffects effects', () => {
  let actions$: Observable<any>;
  let effects: EditedGTrackPoiEffects;
  let poiService: PoiService;
  let pois: Array<ExternalPoi>;
  let getRecordSpy: jasmine.Spy;
  let callSpy: jasmine.Spy;
  let testRecord: any;
  let getSpy: jasmine.Spy;

  beforeEach(() => {
    pois = _.cloneDeep(poiFixtures);

    testRecord = {
      get: getSpy
    };

    getRecordSpy = jasmine.createSpy('getRecord').and.returnValue(testRecord);

    callSpy = jasmine.createSpy('callRpc').and.returnValue(
      of({
        success: true
      })
    );

    const deepstream = {
      getRecord: getRecordSpy,
      callRpc: callSpy
    };

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        EffectsModule.forRoot([EditedGTrackPoiEffects]),
        HttpClientTestingModule,
        DeepstreamModule,
        RouterModule.forRoot([])
      ],
      providers: [
        EditedGTrackPoiEffects,
        provideMockActions(() => actions$),
        {
          provide: PoiService,
          useValue: {
            create: jest.fn()
          }
        },
        {
          provide: DeepstreamService,
          useFactory: () => deepstream
        },
        {
          provide: Router,
          useValue: mockRouter
        }
      ]
    });

    actions$ = TestBed.get(Actions);
    effects = TestBed.get(EditedGTrackPoiEffects);
    poiService = TestBed.get(PoiService);

    spyOn(editedGTrackPoiSelectors, 'getData').and.returnValue(pois[0]);
  });

  describe('save$', () => {
    it('should return poiId observable from SavePoi success', () => {
      spyOn(poiService, 'create').and.returnValue(
        Observable.of({
          id: pois[0].id
        })
      );

      const action = new editedGTrackPoiActions.SavePoi();
      const completion = new editedGTrackPoiActions.PoiSaveSuccess(pois[0].id);
      const expected = cold('-b', { b: completion });

      actions$ = hot('-a', { a: action });

      expect(effects.save$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(editedGTrackPoiSelectors.getData).toBeCalled();
      expect(poiService.create).toBeCalledWith(pois[0]);
    });

    it('should return error observable from SavePoi failure', () => {
      spyOn(poiService, 'create').and.returnValue(Observable.throwError('error'));

      const action = new editedGTrackPoiActions.SavePoi();
      const completion = new editedGTrackPoiActions.PoiSaveFailed('error');
      const expected = cold('-b', { b: completion });

      actions$ = hot('-a', { a: action });

      expect(effects.save$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(editedGTrackPoiSelectors.getData).toBeCalled();
      expect(poiService.create).toBeCalledWith(pois[0]);
    });
  });
});
