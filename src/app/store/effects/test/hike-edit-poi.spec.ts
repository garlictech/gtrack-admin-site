import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterModule, Router } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { Actions, EffectsModule } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { IExternalPoi } from '../../../shared/interfaces';
import { hot, cold, Scheduler } from 'jest-marbles';
import { DeepstreamService } from '../../../../subrepos/deepstream-ngx';
import { DeepstreamModule, RouteService } from '../../../../subrepos/gtrack-common-ngx';
import { TestActions, getActions, mockRouter } from './helpers';
import {
  HikeProgramService,
  WikipediaPoiService,
  OsmPoiService,
  GooglePoiService,
  // OsmRoutePoiService
} from '../../../shared/services';
import { hikeEditPoiActions, commonPoiActions, editedGTrackPoiActions } from '../../actions';
import { HikeEditPoiEffects } from '../hike-edit-poi';

import * as _ from 'lodash';

import { pois as poiFixtures } from '../../reducer/test/fixtures';

describe('HikeEditPoiEffects effects', () => {
  let actions$: TestActions;
  let effects: HikeEditPoiEffects;
  let routeService: RouteService;
  let hikeProgramService: HikeProgramService;
  let wikipediaPoiService: WikipediaPoiService;
  let googlePoiService: GooglePoiService;
  let osmPoiService: OsmPoiService;
  // let osmRoutePoiService: OsmRoutePoiService;
  let pois: IExternalPoi[];
  const mockBounds = {
    SouthWest: { lat: 0, lon: 0 },
    NorthEast: { lat: 1, lon: 1 }
  };

  beforeEach(() => {
    pois = _.cloneDeep(poiFixtures);

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        EffectsModule.forRoot([HikeEditPoiEffects]),
        HttpClientTestingModule,
        DeepstreamModule.forRoot(),
        RouterModule.forRoot([])
      ],
      providers: [
        HikeEditPoiEffects,
        RouteService,
        HikeProgramService,
        {
          provide: Actions,
          useFactory: getActions
        },
        {
          provide: DeepstreamService,
          useValue: {}
        },
        {
          provide: Router,
          useValue: mockRouter
        },
        {
          provide: HikeProgramService,
          useValue: {
            getDescriptionLanguages: () => ['en', 'hu']
          }
        },
        {
          provide: RouteService,
          useValue: {
            splitBounds: (bounds, maxRadius, boundsArr) => {
              boundsArr.push(bounds);
            }
          }
        },
        {
          provide: WikipediaPoiService,
          useValue: {
            get: () => {}
          }
        },
        {
          provide: OsmPoiService,
          useValue: {
            get: () => {}
          }
        },
        /*{
          provide: OsmRoutePoiService,
          useValue: {
            get: () => {}
          }
        },*/
        {
          provide: GooglePoiService,
          useValue: {
            get: () => {}
          }
        }
      ]
    });

    actions$ = TestBed.get(Actions);
    effects = TestBed.get(HikeEditPoiEffects);
    routeService = TestBed.get(RouteService);
    hikeProgramService = TestBed.get(HikeProgramService);
    wikipediaPoiService = TestBed.get(WikipediaPoiService);
    googlePoiService = TestBed.get(GooglePoiService);
    osmPoiService = TestBed.get(OsmPoiService);
    // osmRoutePoiService = TestBed.get(OsmRoutePoiService);
  });

  describe('getWikipediaPois$', () => {
    it('should return pois observable from getWikipediaPois', () => {
      spyOn(routeService, 'splitBounds').and.callThrough();
      spyOn(hikeProgramService, 'getDescriptionLanguages').and.callThrough();
      spyOn(wikipediaPoiService, 'get').and.returnValue(Observable.of(pois));

      const action = new hikeEditPoiActions.GetWikipediaPois(mockBounds, 'fakeMapId');
      const completion = new hikeEditPoiActions.SetWikipediaPois(pois);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.getWikipediaPois$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(routeService.splitBounds).toHaveBeenCalled();
      expect(hikeProgramService.getDescriptionLanguages).toHaveBeenCalled();
      expect(wikipediaPoiService.get).toHaveBeenCalled();
    });
  });

  describe('getGooglePois$', () => {
    it('should return pois observable from GetGooglePois', () => {
      spyOn(hikeProgramService, 'getDescriptionLanguages').and.callThrough();
      spyOn(googlePoiService, 'get').and.returnValue(Observable.of(pois));

      const action = new hikeEditPoiActions.GetGooglePois(mockBounds, 'fakeMapId');
      const completion = new hikeEditPoiActions.SetGooglePois([...pois]);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.getGooglePois$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(hikeProgramService.getDescriptionLanguages).toHaveBeenCalled();
      expect(googlePoiService.get).toHaveBeenCalled();
    });
  });

  describe('getOsmNaturalPois$', () => {
    it('should return pois observable from GetOsmNaturalPois', () => {
      spyOn(osmPoiService, 'get').and.returnValue(Observable.of(pois));

      const action = new hikeEditPoiActions.GetOsmNaturalPois(mockBounds, 'fakeMapId');
      const completion = new hikeEditPoiActions.SetOsmNaturalPois(pois);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.getOsmNaturalPois$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(osmPoiService.get).toHaveBeenCalled();
    });
  });

  describe('getOsmAmenityPois$', () => {
    it('should return pois observable from GetOsmAmenityPois', () => {
      spyOn(osmPoiService, 'get').and.returnValue(Observable.of(pois));

      const action = new hikeEditPoiActions.GetOsmAmenityPois(mockBounds, 'fakeMapId');
      const completion = new hikeEditPoiActions.SetOsmAmenityPois(pois);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.getOsmAmenityPois$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(osmPoiService.get).toHaveBeenCalled();
    });
  });

  /*
  describe('getOsmRoutePois$', () => {
    it('should return pois observable from GetOsmRoutePois', () => {
      spyOn(osmRoutePoiService, 'get').and.returnValue(Observable.of(pois));

      const action = new hikeEditPoiActions.GetOsmRoutePois(mockBounds, 'fakeMapId');
      const completion = new hikeEditPoiActions.SetOsmRoutePois(pois);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.getOsmRoutePois$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(osmRoutePoiService.get).toHaveBeenCalled();
    });
  });
  */

  describe('loadSavedPoi$', () => {
    it('should return poiId observable from PoiSaved', () => {
      const action = new commonPoiActions.PoiSaved('fakePoiId');
      const completion = new commonPoiActions.LoadPoi('fakePoiId');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadSavedPoi$).toBeObservable(expected);
    });
  });

  describe('loadModifiedPoi$', () => {
    it('should return poiId observable from PoiSaveSuccess', () => {
      const action = new editedGTrackPoiActions.PoiSaveSuccess('fakePoiId');
      const completion = new commonPoiActions.LoadPoi('fakePoiId');
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadModifiedPoi$).toBeObservable(expected);
    });
  });
});
