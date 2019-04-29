import { cold, hot, Scheduler } from 'jest-marbles';
import * as _ from 'lodash';
import { Observable, of } from 'rxjs';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { DeepstreamModule, DeepstreamService } from '@bit/garlictech.angular-features.common.deepstream-ngx';
import { GeospatialService } from '@bit/garlictech.angular-features.common.geospatial';
import { EObjectState, HikeProgramData } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { HikeProgramService } from '@features/common/hike';
import { Actions, EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { StoreModule } from '@ngrx/store';

import { ExternalPoi } from '../../../shared/interfaces';
import * as editedHikeProgramSelectors from '../../../store/selectors/edited-hike-program';
import * as hikeEditRoutePlannerSelectors from '../../../store/selectors/hike-edit-route-planner';
import { commonRouteActions, editedHikeProgramActions } from '../../actions';
import { hikePrograms as hikeProgramFixtures, pois as poiFixtures } from '../../reducer/test/fixtures';
import { EditedHikeProgramEffects } from '../edited-hike-program';
import { mockRouter } from './helpers';

describe('EditedHikeProgramEffects effects', () => {
  let actions$: Observable<any>;
  let effects: EditedHikeProgramEffects;
  let hikeProgramService: HikeProgramService;
  let geospatialService: GeospatialService;
  let pois: Array<ExternalPoi>;
  let hikePrograms: Array<HikeProgramData>;
  let getRecordSpy: jasmine.Spy;
  let callSpy: jasmine.Spy;
  let testRecord: any;
  let getSpy: jasmine.Spy;

  beforeEach(() => {
    pois = _.cloneDeep(poiFixtures);
    hikePrograms = _.cloneDeep(hikeProgramFixtures);

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
        EffectsModule.forRoot([EditedHikeProgramEffects]),
        HttpClientTestingModule,
        DeepstreamModule,
        RouterModule.forRoot([])
      ],
      providers: [
        EditedHikeProgramEffects,
        GeospatialService,
        provideMockActions(() => actions$),
        {
          provide: HikeProgramService,
          useValue: {
            save: jest.fn()
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
    effects = TestBed.get(EditedHikeProgramEffects);
    hikeProgramService = TestBed.get(HikeProgramService);
    geospatialService = TestBed.get(GeospatialService);

    spyOn(editedHikeProgramSelectors, 'getData').and.returnValue(hikePrograms[0]);
    spyOn(geospatialService, 'distanceOnLine').and.returnValue(20);
    spyOn(hikeEditRoutePlannerSelectors, 'getPath').and.returnValue({
      geometry: {
        coordinates: [[0, 0]]
      }
    });
  });

  describe('prepareThenAddStop$', () => {
    it('should return poiId observable from SavePoi success', () => {
      const poi = _.merge(pois[0], {
        timestamp: 0,
        state: EObjectState.published
      });
      const stop = {
        distanceFromOrigo: 20,
        onRoute: poi.onRoute || false,
        poiId: poi.id,
        lat: poi.lat,
        lon: poi.lon,
        // Segment data will be calculated after inserting the stop
        segment: {
          uphill: 0,
          downhill: 0,
          distance: 0,
          score: 0,
          time: 0
        }
      };
      const action = new editedHikeProgramActions.PrepareThenAddStop(poi);
      const completion = new editedHikeProgramActions.AddStop(stop);
      const expected = cold('-b', { b: completion });

      actions$ = hot('-a', { a: action });

      expect(effects.prepareThenAddStop$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(hikeEditRoutePlannerSelectors.getPath).toBeCalled();
      expect(geospatialService.distanceOnLine).toBeCalled();
    });
  });

  describe('save$', () => {
    it('should return hikeProgramId observable from SaveHikeProgram success', () => {
      spyOn(hikeProgramService, 'save').and.returnValue(
        Observable.of({
          id: hikePrograms[0].id
        })
      );

      const action = new editedHikeProgramActions.SaveHikeProgram();
      const completion = new editedHikeProgramActions.HikeProgramSaveSuccess();
      const expected = cold('-b', { b: completion });

      actions$ = hot('-a', { a: action });

      expect(effects.save$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(editedHikeProgramSelectors.getData).toBeCalled();
      expect(hikeProgramService.save).toBeCalled();
    });

    it('should return error observable from SaveHikeProgram failure', () => {
      spyOn(hikeProgramService, 'save').and.returnValue(Observable.throwError('error'));

      const action = new editedHikeProgramActions.SaveHikeProgram();
      const completion = new editedHikeProgramActions.HikeProgramSaveFailed('error');
      const expected = cold('-b', { b: completion });

      actions$ = hot('-a', { a: action });

      expect(effects.save$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(editedHikeProgramSelectors.getData).toBeCalled();
      expect(hikeProgramService.save).toBeCalled();
    });
  });

  describe('loadSavedRoute$', () => {
    it('should return context observable from RouteSaved success', () => {
      spyOn(hikeProgramService, 'save').and.returnValue(Observable.throwError('error'));

      const context = 'routeId';
      const action = new commonRouteActions.RouteSaved(context);
      const completion = new commonRouteActions.LoadRoute(context);
      const expected = cold('-b', { b: completion });

      actions$ = hot('-a', { a: action });

      expect(effects.loadSavedRoute$).toBeObservable(expected);
    });
  });
});
