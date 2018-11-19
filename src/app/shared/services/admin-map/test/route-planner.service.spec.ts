import { TestBed } from '@angular/core/testing';
import { AdminMapService } from '../admin-map.service';
import {
  RouteService, GameRuleService
} from '../../../../../subrepos/gtrack-common-ngx';
import { EMPTY } from 'rxjs';
import * as hikeEditMapSelectors from '../../../../store/selectors/hike-edit-map';
import * as hikeEditRoutePlannerSelectors from '../../../../store/selectors/hike-edit-route-planner';
import { StoreModule, Store } from '@ngrx/store';
import { hikeEditMapReducer } from '../../../../store/reducer';
import { State } from '../../../../store';
import { RoutePlannerService } from '../route-planner.service';
import { MOCK_SEGMENTS, MOCK_SEGMENT_TOTAL, MOCK_SEGMENT_GEOJSON } from './fixtures/segments';
import { hikeEditRoutePlannerActions } from '../../../../store/actions';

import * as _ from 'lodash';

describe('RoutePlannerService', () => {
  let routePlannerService: RoutePlannerService;
  let store: Store<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          hikeEditMap: hikeEditMapReducer
        })
      ],
      providers: [
        RoutePlannerService,
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

  it('should add route to the store', (done) => {
    const storeSpy = jest.spyOn(store, 'dispatch');
    const route = 'fakeRouteData';
    const action = new hikeEditRoutePlannerActions.AddRoute(route);

    routePlannerService.addRouteToTheStore(route);

    expect(storeSpy).toBeCalledWith(action);

    done();
  });

  it('should add route segment', (done) => {
    const storeSpy = jest.spyOn(store, 'dispatch');
    const segment = 'mockSegment';
    const action = new hikeEditRoutePlannerActions.PushSegment(segment);

    jest.spyOn(routePlannerService, 'createRouteSegment').mockReturnValue(segment);

    routePlannerService.addRouteSegment([], {});

    expect(storeSpy).toBeCalledWith(action);

    done();
  });

  it('should update route segment', (done) => {
    const storeSpy = jest.spyOn(store, 'dispatch');
    const segmentIdx = 0;
    const segment = 'mockSegment';
    const action = new hikeEditRoutePlannerActions.UpdateSegment(segmentIdx, segment);

    jest.spyOn(routePlannerService, 'createRouteSegment').mockReturnValue(segment);

    routePlannerService.updateRouteSegment(segmentIdx, [], {});

    expect(storeSpy).toBeCalledWith(action);

    done();
  });

  it('should create route segment', (done) => {

    const updown = {
      uphill: 10,
      downhill: 20
    };
    const coordinates = [[0, 0], [0, 0]];
    const expected = {
      distance: 0,
      uphill: updown.uphill,
      downhill: updown.downhill,
      coordinates: coordinates
    };
    const segment = routePlannerService.createRouteSegment(coordinates, updown);

    expect(segment).toEqual(expected);

    done();
  });

  it('should remove last segment', (done) => {
    const storeSpy = jest.spyOn(store, 'dispatch');
    const action = new hikeEditRoutePlannerActions.PopSegment();

    routePlannerService.removeLastSegment();

    expect(storeSpy).toBeCalledWith(action);

    done();
  });

  it('should calculate total from segment', (done) => {
    const total = routePlannerService['_calculateTotal'](MOCK_SEGMENTS);
    const expected = MOCK_SEGMENT_TOTAL;

    expect(expected).toEqual(total);

    done();
  });

  it('should create geoJSON from segment', (done) => {
    const total = routePlannerService['_createGeoJsonFromSegments'](MOCK_SEGMENTS);
    const expected = MOCK_SEGMENT_GEOJSON;

    expect(expected).toEqual(total);

    done();
  });

  it('should create route point', (done) => {
    const total = routePlannerService['_createRoutePoint'](MOCK_SEGMENTS[0].coordinates[0], 1);
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

  it('should get last point of last segment', (done) => {
    const total = routePlannerService['_getLastPointOfLastSegment'](MOCK_SEGMENTS);
    const expected = [...MOCK_SEGMENTS].pop().coordinates.pop();

    expect(expected).toEqual(total);

    done();
  });

  it('should get search bounds', (done) => {
    const total = routePlannerService['_getLastPointOfLastSegment'](MOCK_SEGMENTS);
    const expected = [...MOCK_SEGMENTS].pop().coordinates.pop();

    expect(expected).toEqual(total);

    done();
  });
});
