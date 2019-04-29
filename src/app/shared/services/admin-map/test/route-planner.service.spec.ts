import * as _ from 'lodash';
import { EMPTY } from 'rxjs';

import { TestBed } from '@angular/core/testing';
import { LeafletMapService } from '@bit/garlictech.angular-features.common.leaflet-map';
import { Store, StoreModule } from '@ngrx/store';

import { State } from '../../../../store';
import { hikeEditRoutePlannerActions } from '../../../../store/actions';
import { AdminMapService } from '../admin-map.service';
import { RoutePlannerService } from '../route-planner.service';
import { MOCK_SEGMENT_GEOJSON, MOCK_SEGMENT_TOTAL, MOCK_SEGMENTS } from './fixtures/segments';
import { RouteService } from '@features/common/route';
import { GameRuleService } from '@features/common/game-rule';

describe('RoutePlannerService', () => {
  let routePlannerService: RoutePlannerService;
  let store: Store<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [
        RoutePlannerService,
        {
          provide: LeafletMapService,
          useValue: {
            addLayer: jest.fn(),
            removeLayer: jest.fn(),
            refreshSpiderfierMarkers: jest.fn(),
            leafletMap: jest.fn(),
            spin: jest.fn()
          }
        },
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => EMPTY)
          }
        },
        /* TODO
        {
          provide: HikeEditRoutePlannerSelectors,
          useValue: {
            getSegments: jest.fn(() => {})
          }
        },
        {
          provide: HikeEditMapSelectors,
          useValue: {
            getMapId: jest.fn(() => 'fakeMapId')
          }
        },*/
        {
          provide: GameRuleService,
          useValue: {
            segmentTime: jest.fn(() => {}),
            score: jest.fn(() => {})
          }
        },
        {
          provide: RouteService,
          useValue: {
            getBounds: jest.fn(() => {})
          }
        },
        {
          provide: AdminMapService,
          useValue: {}
        }
      ]
    });

    routePlannerService = TestBed.get(RoutePlannerService);
    store = TestBed.get(Store);
  });

  it('should be created', () => {
    expect(routePlannerService).toBeTruthy();
  });

  it('should add route to the store', done => {
    const storeSpy = jest.spyOn(store, 'dispatch');
    const route = 'fakeRouteData';
    const action = new hikeEditRoutePlannerActions.AddRoute(route);

    routePlannerService.addRouteToTheStore(route);

    expect(storeSpy).toBeCalledWith(action);

    done();
  });

  it('should add route segment', done => {
    const storeSpy = jest.spyOn(store, 'dispatch');
    const segment = 'mockSegment';
    const action = new hikeEditRoutePlannerActions.PushSegment(segment);

    jest.spyOn(routePlannerService, 'createRouteSegment').mockReturnValue(segment);

    routePlannerService.addRouteSegment([], {});

    expect(storeSpy).toBeCalledWith(action);

    done();
  });

  it('should update route segment', done => {
    const storeSpy = jest.spyOn(store, 'dispatch');
    const segmentIdx = 0;
    const segment = 'mockSegment';
    const action = new hikeEditRoutePlannerActions.UpdateSegment(segmentIdx, segment);

    jest.spyOn(routePlannerService, 'createRouteSegment').mockReturnValue(segment);

    routePlannerService.updateRouteSegment(segmentIdx, [], {});

    expect(storeSpy).toBeCalledWith(action);

    done();
  });

  it('should create route segment', done => {
    const updown = {
      uphill: 10,
      downhill: 20
    };
    const coordinates = [[0, 0], [0, 0]];
    const expected = {
      distance: 0,
      uphill: updown.uphill,
      downhill: updown.downhill,
      coordinates
    };
    const segment = routePlannerService.createRouteSegment(coordinates, updown);

    expect(segment).toEqual(expected);

    done();
  });

  it('should remove last segment', done => {
    const storeSpy = jest.spyOn(store, 'dispatch');
    const action = new hikeEditRoutePlannerActions.PopSegment();

    routePlannerService.removeLastSegment();

    expect(storeSpy).toBeCalledWith(action);

    done();
  });

  it('should calculate total from segment', done => {
    const total = routePlannerService._calculateTotal(MOCK_SEGMENTS);
    const expected = MOCK_SEGMENT_TOTAL;

    expect(expected).toEqual(total);

    done();
  });

  it('should create geoJSON from segment', done => {
    const total = routePlannerService._createGeoJsonFromSegments(MOCK_SEGMENTS);
    const expected = MOCK_SEGMENT_GEOJSON;

    expect(expected).toEqual(total);

    done();
  });

  it('should create route point', done => {
    const total = routePlannerService._createRoutePoint(MOCK_SEGMENTS[0].coordinates[0], 1);
    const expected = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          MOCK_SEGMENTS[0].coordinates[0][1],
          MOCK_SEGMENTS[0].coordinates[0][0],
          MOCK_SEGMENTS[0].coordinates[0][2]
        ]
      },
      properties: {
        name: `Route point 1`
      }
    };

    expect(expected).toEqual(total);

    done();
  });

  it('should get last point of last segment', done => {
    const total = routePlannerService._getLastPointOfLastSegment(MOCK_SEGMENTS);
    const expected = [...MOCK_SEGMENTS].pop().coordinates.pop();

    expect(expected).toEqual(total);

    done();
  });

  it('should get search bounds', done => {
    const total = routePlannerService._getLastPointOfLastSegment(MOCK_SEGMENTS);
    const expected = [...MOCK_SEGMENTS].pop().coordinates.pop();

    expect(expected).toEqual(total);

    done();
  });
});
