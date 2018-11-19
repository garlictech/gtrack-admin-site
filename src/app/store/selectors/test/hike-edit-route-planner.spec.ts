import { TestBed } from '@angular/core/testing';
import { Store, StoreModule, select } from '@ngrx/store';
import * as hikeEditRoutePlannerSelectors from '../../selectors/hike-edit-route-planner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IHikeEditRoutePlannerState } from '../../state';
import { hikeEditRoutePlannerReducer, initialRouteInfoDataState } from '../../reducer';
import { hikeEditRoutePlannerActions } from '../../actions';

import { route as routeFixtures, segments as segmentFixtures } from '../../reducer/test/fixtures';

import * as _ from 'lodash';

describe('HikeEditRoutePlanner selectors', () => {
  let store: Store<IHikeEditRoutePlannerState>;
  let destroy$: Subject<boolean>;
  let route: any;
  let segments: any[];

  beforeEach(() => {
    route = _.cloneDeep(routeFixtures);
    segments = _.cloneDeep(segmentFixtures);
    destroy$ = new Subject<boolean>();

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          hikeEditRoutePlanner: hikeEditRoutePlannerReducer
        })
      ]
    });

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
  });

  afterEach(() => {
    destroy$.next(true);
    destroy$.unsubscribe();
  });

  describe('getMapId', () => {
    it('should return route planner', () => {
      let result;

      store
        .pipe(
          select(hikeEditRoutePlannerSelectors.getRoutePlanner),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toEqual(initialRouteInfoDataState);

      store.dispatch(new hikeEditRoutePlannerActions.RoutingStart());
      expect(result).toEqual(_.merge({}, initialRouteInfoDataState, { routing: true }));
    });
  });

  describe('getRoute', () => {
    it('should return route', () => {
      let result;

      store
        .pipe(
          select(hikeEditRoutePlannerSelectors.getRoute),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toEqual(initialRouteInfoDataState.route);

      store.dispatch(new hikeEditRoutePlannerActions.AddRoute('fakeRouteData'));
      expect(result).toEqual('fakeRouteData');
    });
  });

  describe('getPath', () => {
    it('should return route path', () => {
      let result;

      store
        .pipe(
          select(hikeEditRoutePlannerSelectors.getPath),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toEqual(initialRouteInfoDataState.route.features[0]);

      store.dispatch(new hikeEditRoutePlannerActions.AddRoute(route));
      expect(result).toEqual(route.features[0]);
    });
  });

  describe('getPathLength', () => {
    it('should return route path length', () => {
      let result;

      store
        .pipe(
          select(hikeEditRoutePlannerSelectors.getPathLength),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toEqual(0);

      store.dispatch(new hikeEditRoutePlannerActions.AddRoute(route));
      expect(result).toEqual(5);
    });
  });

  describe('getSegments', () => {
    it('should return route path length', () => {
      let result;

      store
        .pipe(
          select(hikeEditRoutePlannerSelectors.getSegments),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toEqual([]);

      store.dispatch(new hikeEditRoutePlannerActions.PushSegment(segments[0]));
      expect(result).toEqual([segments[0]]);
    });
  });

  describe('getTotal', () => {
    it('should return route total', () => {
      let result;
      const total = _.pick(segments[0], ['distance', 'uphill', 'downhill', 'time', 'score']);

      store
        .pipe(
          select(hikeEditRoutePlannerSelectors.getTotal),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toEqual({});

      store.dispatch(new hikeEditRoutePlannerActions.UpdateTotal(total));
      expect(result).toEqual(total);
    });
  });

  describe('getIsRoundTrip', () => {
    it('should return route is not roundtrip', () => {
      let result;

      store
        .pipe(
          select(hikeEditRoutePlannerSelectors.getIsRoundTrip),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toBeFalsy();

      store.dispatch(new hikeEditRoutePlannerActions.AddRoute(route));
      expect(result).toBeFalsy();
    });

    it('should return route is roundtrip', () => {
      let result;

      store
        .pipe(
          select(hikeEditRoutePlannerSelectors.getIsRoundTrip),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toBeFalsy();

      route.features[0].geometry.coordinates[4] = [0, 0];

      store.dispatch(new hikeEditRoutePlannerActions.AddRoute(route));
      expect(result).toBeTruthy();
    });
  });

  describe('getIsPlanning', () => {
    it('should return route is planning', () => {
      let result;

      store
        .pipe(
          select(hikeEditRoutePlannerSelectors.getIsPlanning),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toBeTruthy();

      store.dispatch(new hikeEditRoutePlannerActions.SetPlanning(false));
      expect(result).toBeFalsy();
    });
  });

  describe('getIsRouting', () => {
    it('should return route is routing', () => {
      let result;

      store
        .pipe(
          select(hikeEditRoutePlannerSelectors.getIsRouting),
          takeUntil(destroy$)
        )
        .subscribe(res => (result = res));

      expect(result).toBeFalsy();

      store.dispatch(new hikeEditRoutePlannerActions.RoutingStart());
      expect(result).toBeTruthy();
    });
  });
});
