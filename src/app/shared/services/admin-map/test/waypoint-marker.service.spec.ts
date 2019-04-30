import * as L from 'leaflet';
import * as _ from 'lodash';
import { EMPTY } from 'rxjs';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ElevationService } from '@bit/garlictech.angular-features.common.elevation';
import { LeafletIconService, LeafletMapService } from '@bit/garlictech.angular-features.common.leaflet-map';
import { Store, StoreModule } from '@ngrx/store';

import { State } from '../../../../store';
import { hikeEditRoutePlannerActions } from '../../../../store/actions';
import { AdminMapService } from '../admin-map.service';
import { RoutePlannerService } from '../route-planner.service';
import { Waypoint, WaypointMarkerService } from '../waypoint-marker.service';

describe('WaypointMarkerService', () => {
  let waypointMarkerService: WaypointMarkerService;
  let routePlannerService: RoutePlannerService;
  let store: Store<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StoreModule.forRoot({})],
      providers: [
        WaypointMarkerService,
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => EMPTY)
          }
        },
        {
          provide: AdminMapService,
          useValue: {}
        },
        {
          provide: RoutePlannerService,
          useValue: {
            removeLastSegment: jest.fn(),
            addRouteSegment: jest.fn()
          }
        },
        {
          provide: ElevationService,
          useValue: {}
        },
        {
          provide: LeafletIconService,
          useValue: {}
        },
        {
          provide: LeafletMapService,
          useValue: {
            spin: jest.fn()
          }
        }
      ]
    });

    waypointMarkerService = TestBed.get(WaypointMarkerService);
    routePlannerService = TestBed.get(RoutePlannerService);
    store = TestBed.get(Store);
  });

  it('should be created', () => {
    expect(waypointMarkerService).toBeTruthy();
  });

  describe('should reset service', () => {
    let storeSpy;
    let action;

    beforeEach(() => {
      storeSpy = jest.spyOn(store, 'dispatch');
      action = new hikeEditRoutePlannerActions.ResetRoutePlanningState();

      waypointMarkerService.reset();
    });

    it('should call ResetRoutePlanningState action', done => {
      expect(storeSpy).toBeCalledWith(action);
      done();
    });

    it('should have empty markers array', done => {
      expect(waypointMarkerService._markers).toEqual([]);
      done();
    });
  });

  it('should remove segments', done => {
    const idx = 3;
    const count = 4;

    const storeSpy = jest.spyOn(store, 'dispatch');
    const action = new hikeEditRoutePlannerActions.RemoveSegments(idx, count);

    waypointMarkerService.removeSegments(idx, count);

    expect(storeSpy).toBeCalledWith(action);

    done();
  });

  describe('should insert new start point', () => {
    let latLng;
    let waypoint: Waypoint;

    beforeEach(() => {
      latLng = L.latLng(10, 20);
      waypoint = {
        latLng,
        idx: 0
      };

      waypointMarkerService._createMarker = jest.fn(wp => L.marker(wp.latLng));
      waypointMarkerService._updateMarkerNumbers = jest.fn();
      waypointMarkerService._refreshEndpointMarkerIcons = jest.fn();

      waypointMarkerService.insertNewStartPoint(latLng);
    });

    it('should have markers', done => {
      expect(waypointMarkerService._markers).toEqual([L.marker(waypoint.latLng)]);
      done();
    });

    it('should call _updateMarkerNumbers', done => {
      expect(waypointMarkerService._updateMarkerNumbers).toHaveBeenCalled();
      done();
    });

    it('should call _refreshEndpointMarkerIcons', done => {
      expect(waypointMarkerService._refreshEndpointMarkerIcons).toHaveBeenCalled();
      done();
    });
  });

  describe('should insert new end point', () => {
    let latLng;
    let waypoint: Waypoint;

    beforeEach(() => {
      latLng = L.latLng(10, 20);
      waypoint = {
        latLng,
        idx: 0
      };

      waypointMarkerService._createMarker = jest.fn(wp => L.marker(wp.latLng));
      waypointMarkerService._updateMarkerNumbers = jest.fn();
      waypointMarkerService._refreshEndpointMarkerIcons = jest.fn();

      waypointMarkerService.insertNewEndPoint(latLng);
    });

    it('should have markers', done => {
      expect(waypointMarkerService._markers).toEqual([L.marker(waypoint.latLng)]);
      done();
    });

    it('should call _updateMarkerNumbers', done => {
      expect(waypointMarkerService._updateMarkerNumbers).toHaveBeenCalled();
      done();
    });

    it('should call _refreshEndpointMarkerIcons', done => {
      expect(waypointMarkerService._refreshEndpointMarkerIcons).toHaveBeenCalled();
      done();
    });
  });

  it('should remove last', done => {
    waypointMarkerService._refreshEndpointMarkerIcons = jest.fn();

    waypointMarkerService.removeLast();

    expect(routePlannerService.removeLastSegment).toHaveBeenCalled();
    expect(waypointMarkerService._refreshEndpointMarkerIcons).toHaveBeenCalled();

    done();
  });

  /* TODO FIX
  it('should close circle', done => {
    const marker1 = L.marker(L.latLng(10, 20));
    const marker2 = L.marker(L.latLng(30, 40));

    waypointMarkerService['_markers'] = [marker1, marker2];
    waypointMarkerService.addWaypoints = jest.fn();

    waypointMarkerService.closeCircle();

    expect(waypointMarkerService.addWaypoints).toHaveBeenCalledWith([L.latLng(10, 20)]);

    done();
  });
  */

  /* TODO FIX
  it('should add waypoits', fakeAsync(() => {
    const latLang1 = L.latLng(10, 20);
    const latLang2 = L.latLng(30, 40);

    const storeSpy = jest.spyOn(store, 'dispatch');
    const startAction = new hikeEditRoutePlannerActions.RoutingStart();
    const finishAction = new hikeEditRoutePlannerActions.RoutingFinished();

    waypointMarkerService['_createMarker'] = jest.fn(wp => L.marker(wp.latLng));
    waypointMarkerService.getRouteFromApi = jest.fn(() => Promise.resolve({ coordsArr: [], upDown: {} }));
    waypointMarkerService['_refreshEndpointMarkerIcons'] = jest.fn();
    waypointMarkerService['_moveLastWaypointToRoute'] = jest.fn();
    routePlannerService.addRouteSegment = jest.fn();

    waypointMarkerService.addWaypoints([latLang1, latLang2]);

    expect(storeSpy).toHaveBeenLastCalledWith(startAction);
    expect(waypointMarkerService.getRouteFromApi).toHaveBeenCalled();

    tick(100);

    expect(waypointMarkerService['_refreshEndpointMarkerIcons']).toHaveBeenCalled();
    expect(storeSpy).toHaveBeenLastCalledWith(finishAction);
  }));
  */

  describe('should create marker', () => {
    let latLng;
    let waypoint: Waypoint;
    let marker;

    beforeEach(() => {
      latLng = L.latLng(10, 20);
      waypoint = {
        latLng,
        idx: 0
      };

      marker = waypointMarkerService._createMarker(waypoint);
    });

    it('should have coordinates', done => {
      expect(marker.getLatLng()).toEqual(latLng);
      done();
    });

    it('should have marke options', done => {
      expect(marker.options.draggable).toBeTruthy();
      expect(marker.options.type).toEqual('waypoint');

      done();
    });

    it('should have marker events', done => {
      expect(marker._events.click).toBeDefined();
      expect(marker._events.dragstart).toBeDefined();
      expect(marker._events.dragend).toBeDefined();

      done();
    });
  });

  it('should update marker numbers', done => {
    const marker1 = L.marker(L.latLng(10, 20));
    const marker2 = L.marker(L.latLng(30, 40));

    waypointMarkerService._markers = [marker1, marker2];

    waypointMarkerService._updateMarkerNumbers();

    expect(waypointMarkerService._markers[0].options.icon.options.html).toEqual('<span>1</span>');
    expect(waypointMarkerService._markers[1].options.icon.options.html).toEqual('<span>2</span>');

    done();
  });

  it('should get single marker icon', done => {
    const title = 'mockTitle';
    const expected = L.divIcon({
      html: `<span>${title}</span>`,
      iconSize: [21, 34],
      iconAnchor: [11, 34],
      className: 'routing-control-marker'
    });

    const icon = waypointMarkerService._getSingleMarkerIcon(title);

    expect(icon).toEqual(expected);

    done();
  });
});
