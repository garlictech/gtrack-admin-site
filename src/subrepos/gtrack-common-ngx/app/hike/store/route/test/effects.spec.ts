import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Actions, Effect, EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import * as uuid from 'uuid/v4';
import { DeepstreamService } from 'subrepos/deepstream-ngx';

import { Observable } from 'rxjs/Observable';

import * as _ from 'lodash';

import { hot, cold } from 'jest-marbles';

import { IRouteStored, IRoute, EObjectState } from 'subrepos/provider-client';
import { Route, RouteService } from '../../../services/route';
import { RouteEffects } from '../effects';
import * as routeActions from '../actions';
import { DeepstreamModule } from '../../../../deepstream';
import { UnitsService } from '../../../../shared';
import { GeometryService } from '../../../services/geometry';

class TestActions extends Actions {
  constructor() {
    super(Observable.empty());
  }

  set stream(source: Observable<any>) {
    this.source = source;
  }
}

export function getActions() {
  return new TestActions();
}

describe('Route effects', () => {
  let routeData: IRoute;
  let route: IRouteStored;
  let actions$: TestActions;
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
        {
          provide: Actions,
          useFactory: getActions
        },
        {
          provide: DeepstreamService,
          useValue: {}
        }
      ]
    });

    actions$ = TestBed.get(Actions);
    routeService = TestBed.get(RouteService);
    effects = TestBed.get(RouteEffects);

    spyOn(routeService, 'get').and.callFake(_id => Observable.of(route));
    spyOn(routeService, 'create').and.returnValue(
      Observable.of({
        id: newId
      })
    );

    spyOn(routeService, 'updateState').and.returnValue(Observable.of({
      success: true
    }));
  });

  describe('loadRoute$', () => {
    it('should return a Route from RouteLoaded', () => {
      const action = new routeActions.LoadRoute(id);
      const completion = new routeActions.RouteLoaded(id, route);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadRoute$).toBeObservable(expected);
    });
  });

  describe('saveRoute$', () => {
    it('should return the id of the created Route from RouteCreated', () => {
      const action = new routeActions.SaveRoute(routeData);
      const completion = new routeActions.RouteSaved(newId);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.saveRoute$).toBeObservable(expected);
    });
  });

  describe('updateState$', () => {
    it('should return a LoadRoute action', () => {
      const action = new routeActions.UpdateRouteState(routeData.id, EObjectState.published);
      const completion = new routeActions.LoadRoute(routeData.id);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateState$).toBeObservable(expected);
    });
  });
});
