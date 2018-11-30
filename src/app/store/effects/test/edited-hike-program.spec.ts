import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { Actions, EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { hot, cold, Scheduler } from 'jest-marbles';
import { EditedHikeProgramEffects } from '../edited-hike-program';
import { DeepstreamService } from '../../../../subrepos/deepstream-ngx';
import { DeepstreamModule, HikeProgramService, GeospatialService } from '../../../../subrepos/gtrack-common-ngx';
import { RouterModule, Router } from '@angular/router';
import { mockRouter } from './helpers';
import { editedHikeProgramActions, commonRouteActions } from '../../actions';
import { IHikeProgram, EObjectState } from 'subrepos/provider-client';
import { IExternalPoi } from '../../../shared/interfaces';
import * as editedHikeProgramSelectors from '../../../store/selectors/edited-hike-program';
import * as hikeEditRoutePlannerSelectors from '../../../store/selectors/hike-edit-route-planner';
import * as _ from 'lodash';

import { pois as poiFixtures, hikePrograms as hikeProgramFixtures } from '../../reducer/test/fixtures';

describe('EditedHikeProgramEffects effects', () => {
  let actions$: Observable<any>;
  let effects: EditedHikeProgramEffects;
  let hikeProgramService: HikeProgramService;
  let geospatialService: GeospatialService;
  let pois: IExternalPoi[];
  let hikePrograms: IHikeProgram[];

  beforeEach(() => {
    pois = _.cloneDeep(poiFixtures);
    hikePrograms = _.cloneDeep(hikeProgramFixtures);

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        EffectsModule.forRoot([EditedHikeProgramEffects]),
        HttpClientTestingModule,
        DeepstreamModule.forRoot(),
        RouterModule.forRoot([])
      ],
      providers: [
        EditedHikeProgramEffects,
        HikeProgramService,
        GeospatialService,
        provideMockActions(() => actions$),
        {
          provide: DeepstreamService,
          useValue: {}
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

  describe('loadSavedRoute$', () => {
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
