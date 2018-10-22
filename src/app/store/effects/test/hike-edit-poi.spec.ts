import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterModule, Router } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { Actions, EffectsModule } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { IExternalPoi } from '../../../shared/interfaces';
import { hot, cold } from 'jest-marbles';
import { DeepstreamService } from '../../../../subrepos/deepstream-ngx';
import { DeepstreamModule, RouteService, GeometryService } from '../../../../subrepos/gtrack-common-ngx';
import { TestActions, getActions, mockRouter } from './helpers';
import { HikeProgramService, WikipediaPoiService, OsmPoiService, GooglePoiService, OsmRoutePoiService } from '../../../shared/services';
import { hikeEditPoiActions, commonPoiActions, editedGTrackPoiActions } from '../../actions';
import { HikeEditPoiEffects } from '../hike-edit-poi';

import * as _ from 'lodash';

import {
  pois as poiFixtures
} from '../../reducer/test/fixtures';

describe('HikeEditPoiEffects effects', () => {
  let actions$: TestActions;
  let effects: HikeEditPoiEffects;
  let pois: IExternalPoi[];

  beforeEach(() => {
    pois = _.cloneDeep(poiFixtures);

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        EffectsModule.forRoot([
          HikeEditPoiEffects
        ]),
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
            getDescriptionLaguages: () => ['en', 'hu']
          }
        },
        {
          provide: RouteService,
          useValue: {
            splitBounds: (bounds, maxRadius, boundsArr) => {
              boundsArr.push(bounds);
            }
          }
        },
        {
          provide: WikipediaPoiService,
          useValue: {
            get: () => Observable.of(pois)
          }
        },
        {
          provide: OsmPoiService,
          useValue: {
            get: () => Observable.of(pois)
          }
        },
        {
          provide: OsmRoutePoiService,
          useValue: {
            get: () => Observable.of(pois)
          }
        },
        {
          provide: GooglePoiService,
          useValue: {
            get: () => Observable.of(pois)
          }
        }
      ]
    });

    actions$ = TestBed.get(Actions);
    effects = TestBed.get(HikeEditPoiEffects);
  });

  describe('getWikipediaPois$', () => {
    it('should return pois observable from getWikipediaPois', () => {
      const action = new hikeEditPoiActions.GetWikipediaPois(['fakeBounds'], 'fakeMapId');
      const completion = new hikeEditPoiActions.SetWikipediaPois(pois);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.getWikipediaPois$).toBeObservable(expected);
    });
  });

  describe('getGooglePois$', () => {
    it('should return pois observable from GetGooglePois', () => {
      const action = new hikeEditPoiActions.GetGooglePois(['fakeBounds'], 'fakeMapId');
      const completion = new hikeEditPoiActions.SetGooglePois([...pois, ...pois]); // 2 langs!
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.getGooglePois$).toBeObservable(expected);
    });
  });

  describe('getOsmNaturalPois$', () => {
    it('should return pois observable from GetOsmNaturalPois', () => {
      const action = new hikeEditPoiActions.GetOsmNaturalPois(['fakeBounds'], 'fakeMapId');
      const completion = new hikeEditPoiActions.SetOsmNaturalPois(pois);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.getOsmNaturalPois$).toBeObservable(expected);
    });
  });

  describe('getOsmAmenityPois$', () => {
    it('should return pois observable from GetOsmAmenityPois', () => {
      const action = new hikeEditPoiActions.GetOsmAmenityPois(['fakeBounds'], 'fakeMapId');
      const completion = new hikeEditPoiActions.SetOsmAmenityPois(pois);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.getOsmAmenityPois$).toBeObservable(expected);
    });
  });

  describe('getOsmRoutePois$', () => {
    it('should return pois observable from GetOsmRoutePois', () => {
      const action = new hikeEditPoiActions.GetOsmRoutePois(['fakeBounds'], 'fakeMapId');
      const completion = new hikeEditPoiActions.SetOsmRoutePois(pois);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.getOsmRoutePois$).toBeObservable(expected);
    });
  });

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
