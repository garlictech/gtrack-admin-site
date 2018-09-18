import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { IRouteStored } from 'subrepos/provider-client';
import { Subject } from 'rxjs/Subject';

import { routeReducer } from '../reducer';
import { IRouteState } from '../state';

import * as actions from '../actions';
import { RouteSelectors } from '../selectors';
import { EXTERNAL_ROUTE_DEPENDENCIES } from '../../../externals';

import { routesStored as routeFixtures } from './fixtures';

describe('Route selectors', () => {
  let store: Store<IRouteState>;
  let routes: IRouteStored[];
  let ids: string[];
  let destroy$: Subject<boolean>;

  beforeEach(() => {
    routes = [...routeFixtures];
    ids = routes.map(route => route.id);
    destroy$ = new Subject<boolean>();

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          route: routeReducer
        })
      ],
      providers: [
        RouteSelectors,
        {
          provide: EXTERNAL_ROUTE_DEPENDENCIES,
          useValue: {
            storeDomain: 'route'
          }
        }
      ]
    });

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
  });

  afterEach(() => {
    destroy$.next(true);
    destroy$.unsubscribe();
  });

  describe('getRouteIds', () => {
    it('should return all route ids', () => {
      let result;
      const routeSelectors: RouteSelectors = TestBed.get(RouteSelectors);

      store
        .select(routeSelectors.getRouteIds)
        .takeUntil(destroy$)
        .subscribe(_ids => (result = _ids));

      expect(result).toEqual([]);

      routes.forEach(route => {
        store.dispatch(new actions.RouteLoaded(route.id, route));
      });

      expect(result).toEqual(ids);
    });
  });

  describe('getAllRoutes', () => {
    it('should return all routes', () => {
      let result;
      const routeSelectors: RouteSelectors = TestBed.get(RouteSelectors);

      store
        .select(routeSelectors.getAllRoutes)
        .takeUntil(destroy$)
        .subscribe(_routes => (result = _routes));

      expect(result).toEqual([]);

      routes.forEach(route => {
        store.dispatch(new actions.RouteLoaded(route.id, route));
      });

      expect(result).toEqual(routes);
    });
  });

  describe('getRoute', () => {
    it('should return route by id', () => {
      let result;
      const routeSelectors: RouteSelectors = TestBed.get(RouteSelectors);

      store
        .select(routeSelectors.getRoute(ids[0]))
        .takeUntil(destroy$)
        .subscribe(route => (result = route));

      expect(result).toEqual(undefined);

      routes.forEach(route => {
        store.dispatch(new actions.RouteLoaded(route.id, route));
      });

      expect(result).toEqual(routes[0]);
    });
  });
});
