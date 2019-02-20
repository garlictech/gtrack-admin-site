import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Actions, EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { StoreModule } from '@ngrx/store';
import * as uuid from 'uuid/v4';
import { DeepstreamService } from '@features/common/deepstream-ngx';

import { Observable, EMPTY, of } from 'rxjs';

import { hot, cold, Scheduler } from 'jest-marbles';

import { RouteStored, RouteData, EObjectState } from '@features/common/gtrack-interfaces';
import { RouteService } from '../../../services/route';
import { RouteEffects } from '../effects';
import * as routeActions from '../actions';
import { DeepstreamModule } from '../../../../deepstream';
import { UnitsService } from '../../../../shared';
import { GeometryService } from '../../../services/geometry';

describe('Route effects', () => {
  let routeData: RouteData;
  let route: RouteStored;
  let actions$: Observable<any>;
  let routeService: RouteService;
  let effects: RouteEffects;

  let id: string;
  let newId: string;

  beforeEach(() => {
    id = uuid();
    newId = uuid();

    routeData = {
      bounds: {
        NorthEast: {
          lat: 47.498993,
          lon: 19.043699
        },
        SouthWest: {
          lat: 47.497157,
          lon: 19.049757
        }
      },
      route: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              name: 'Test'
            },
            geometry: {
              type: 'Point',
              coordinates: [18.95623999999998, 47.57855, 305.3887023925781]
            }
          }
        ]
      }
    };

    route = {
      ...routeData,
      id,
      timestamp: new Date().getTime()
    };

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        HttpClientTestingModule,
        DeepstreamModule.forRoot()
      ],
      providers: [
        RouteService,
        RouteEffects,
        GeometryService,
        UnitsService,
        provideMockActions(() => actions$),
        {
          provide: DeepstreamService,
          useValue: {}
        }
      ]
    });

    routeService = TestBed.get(RouteService);
    effects = TestBed.get(RouteEffects);

    spyOn(routeService, 'get').and.callFake(_id => of(route));
    spyOn(routeService, 'create').and.returnValue(
      of({
        id: newId
      })
    );

    spyOn(routeService, 'updateState').and.returnValue(
      of({
        success: true
      })
    );
  });

  describe('loadRoute$', () => {
    it('should return a Route from RouteLoaded', () => {
      const action = new routeActions.LoadRoute(id);
      const completion = new routeActions.RouteLoaded(id, route);
      const expected = cold('-b', { b: completion });

      actions$ = hot('-a', { a: action });

      expect(effects.loadRoute$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(routeService.get).toHaveBeenCalledWith(id);
    });
  });

  describe('saveRoute$', () => {
    it('should return the id of the created Route from RouteCreated', () => {
      const action = new routeActions.SaveRoute(routeData);
      const completion = new routeActions.RouteSaved(newId);
      const expected = cold('-b', { b: completion });

      actions$ = hot('-a', { a: action });

      expect(effects.saveRoute$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(routeService.create).toHaveBeenCalledWith(routeData);
    });
  });

  describe('updateState$', () => {
    it('should return a LoadRoute action', () => {
      const action = new routeActions.UpdateRouteState(routeData.id, EObjectState.published);
      const completion = new routeActions.LoadRoute(routeData.id);
      const expected = cold('-b', { b: completion });

      actions$ = hot('-a', { a: action });

      expect(effects.updateState$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(routeService.updateState).toHaveBeenCalledWith(routeData.id, EObjectState.published);
    });
  });
});
