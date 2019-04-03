import * as L from 'leaflet';
import * as _ from 'lodash';
import { take } from 'rxjs/operators';

import { EventEmitter } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';

import { DEFAULT_LAYERS, DEFAULT_OVERLAY_LAYERS } from '../../constants';
import { GEOJSON_STYLES } from '../../constants/geojson-styles';
import { Center, EMarkerType, LeafletMapConfig } from '../../interfaces';
import { reducer } from '../../store';
import { featureName } from '../../store/state';
import { LeafletMapService } from '../leaflet-map.service';

describe('LeafletMapService', () => {
  let leafletMapService: LeafletMapService;
  let mapElement: HTMLDivElement;
  let center: Center;
  let mapConfig: LeafletMapConfig;
  const mockGeoJSONObject: any = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [125.6, 10.1]
    },
    properties: {
      name: 'Fake geoJSON'
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          [featureName]: reducer
        })
      ],
      providers: [
        LeafletMapService,
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(() => 1)
          }
        }
      ]
    });

    leafletMapService = TestBed.get(LeafletMapService);

    mapElement = document.createElement('div');
    center = {
      lat: 0,
      lng: 0,
      zoom: 15
    };
  });

  it('should be created', () => {
    expect(leafletMapService).toBeTruthy();
  });

  describe('Create map', () => {
    it('should create base map', done => {
      mapConfig = {};

      leafletMapService.createMap(
        'testMap',
        mapElement,
        center,
        DEFAULT_LAYERS,
        DEFAULT_OVERLAY_LAYERS,
        ['trails'],
        mapConfig
      );

      expect(leafletMapService.leafletMap).toBeDefined();
      expect(leafletMapService.baseLayers[DEFAULT_LAYERS[0].name]).toBeDefined();
      expect(leafletMapService.overlayLayers[DEFAULT_OVERLAY_LAYERS[0].name]).toBeDefined();
      expect(leafletMapService.overlappingMarkerSpiderfier).toBeUndefined();

      done();
    });

    it('should create full-featured map', done => {
      mapConfig = {
        spiderfier: {},
        fullScreenControl: {}
      };

      leafletMapService.createMap(
        'testMap',
        mapElement,
        center,
        DEFAULT_LAYERS,
        DEFAULT_OVERLAY_LAYERS,
        ['trails'],
        mapConfig
      );

      expect(leafletMapService.overlappingMarkerSpiderfier).toBeDefined();

      done();
    });
  });

  it('should register eventEmitters', done => {
    leafletMapService.createMap('testMap', mapElement, center, DEFAULT_LAYERS, DEFAULT_OVERLAY_LAYERS, ['trails'], {});

    const mapClick = new EventEmitter<L.LeafletMouseEvent>();
    const subscription = mapClick.pipe(take(1)).subscribe(); // Fill the EventEmitter observers array

    const emitSpy = jest.spyOn(mapClick, 'emit');

    const eventEmitters = {
      click: mapClick
    };

    leafletMapService.registerEventEmitters(eventEmitters);

    const latlngPoint = new L.LatLng(10, 10);
    leafletMapService.leafletMap.fireEvent('click', {
      latlng: latlngPoint,
      layerPoint: leafletMapService.leafletMap.latLngToLayerPoint(latlngPoint),
      containerPoint: leafletMapService.leafletMap.latLngToContainerPoint(latlngPoint)
    });

    expect(emitSpy).toHaveBeenCalled();

    subscription.unsubscribe();

    done();
  });

  it('should call fitBounds', done => {
    leafletMapService.createMap('testMap', mapElement, center, DEFAULT_LAYERS, DEFAULT_OVERLAY_LAYERS, ['trails'], {});

    const bounds: L.LatLngBoundsExpression = [[0, 0], [1, 1]];
    const invalidateSpy = jest.spyOn(leafletMapService.leafletMap, 'invalidateSize');
    const boundsSpy = jest.spyOn(leafletMapService.leafletMap, 'fitBounds');

    leafletMapService.fitBounds(bounds);

    expect(invalidateSpy).toBeCalled();
    expect(boundsSpy).toBeCalledWith(bounds, {
      padding: [50, 50]
    });

    done();
  });

  it('should get currentPositionMarker', done => {
    leafletMapService.createMap('testMap', mapElement, center, DEFAULT_LAYERS, DEFAULT_OVERLAY_LAYERS, ['trails'], {});

    expect(leafletMapService['_currentPositionMarker']).toBeUndefined();

    leafletMapService.getCurrentPositionMarker();

    expect(leafletMapService['_currentPositionMarker']).toBeDefined();

    done();
  });

  it('should add GeoJSONObject', done => {
    leafletMapService.createMap('testMap', mapElement, center, DEFAULT_LAYERS, DEFAULT_OVERLAY_LAYERS, ['trails'], {});

    leafletMapService.leafletMap.addLayer = jest.fn();
    const addLayerSpy = jest.spyOn(leafletMapService.leafletMap, 'addLayer');

    const layer = leafletMapService.addGeoJSONObject(mockGeoJSONObject, GEOJSON_STYLES.bigBuffer);

    expect(addLayerSpy).toBeCalled();
    expect(layer).toBeDefined();

    done();
  });

  it('should create featureGroup from GeoJSONObject', done => {
    leafletMapService.createMap('testMap', mapElement, center, DEFAULT_LAYERS, DEFAULT_OVERLAY_LAYERS, ['trails'], {});

    const fetureGroup = leafletMapService.createFeatureGroupFromGeoJSONObject(mockGeoJSONObject, [
      GEOJSON_STYLES.bigBuffer
    ]);

    expect(fetureGroup).toBeDefined();

    done();
  });

  it('should add layer', done => {
    leafletMapService.createMap('testMap', mapElement, center, DEFAULT_LAYERS, DEFAULT_OVERLAY_LAYERS, ['trails'], {});

    const fetureGroup: L.FeatureGroup = new L.FeatureGroup();

    const layer = leafletMapService.addLayer(fetureGroup);

    expect(layer).toEqual(fetureGroup);

    done();
  });

  it('should remove layer', done => {
    leafletMapService.createMap('testMap', mapElement, center, DEFAULT_LAYERS, DEFAULT_OVERLAY_LAYERS, ['trails'], {});

    const fetureGroup: L.FeatureGroup = new L.FeatureGroup();

    const removeLayerSpy = jest.spyOn(leafletMapService.leafletMap, 'removeLayer');
    jest.spyOn(leafletMapService.leafletMap, 'hasLayer').mockReturnValue(true);

    leafletMapService.removeLayer(fetureGroup);

    expect(removeLayerSpy).toHaveBeenCalled();

    done();
  });

  it('should create markersGroup', done => {
    leafletMapService.createMap('testMap', mapElement, center, DEFAULT_LAYERS, DEFAULT_OVERLAY_LAYERS, ['trails'], {});

    const markersGroup = leafletMapService.createMarkersGroup([]);

    expect(markersGroup).toBeInstanceOf(L.LayerGroup);

    done();
  });

  it('should create markersGroup', done => {
    const waypointMarker = L.marker(L.latLng(0, 0), {}) as any;
    waypointMarker.options.type = EMarkerType.WAYPOINT;
    const imageMarker = L.marker(L.latLng(0, 0), {}) as any;
    imageMarker.options.type = EMarkerType.IMAGE;
    const markers = [waypointMarker, imageMarker];

    leafletMapService.createMap('testMap', mapElement, center, DEFAULT_LAYERS, DEFAULT_OVERLAY_LAYERS, ['trails'], {
      spiderfier: {}
    });

    leafletMapService.overlappingMarkerSpiderfier.removeMarker = jest.fn();
    leafletMapService.overlappingMarkerSpiderfier.addMarker = jest.fn();
    leafletMapService.overlappingMarkerSpiderfier.markers = _.cloneDeep(markers);

    const removeMarkerSpy = jest.spyOn(leafletMapService.overlappingMarkerSpiderfier, 'removeMarker');
    const addMarkerSpy = jest.spyOn(leafletMapService.overlappingMarkerSpiderfier, 'addMarker');

    leafletMapService.refreshSpiderfierMarkers(markers, EMarkerType.WAYPOINT);

    expect(removeMarkerSpy).toBeCalledWith(waypointMarker);
    expect(addMarkerSpy).toBeCalledWith(waypointMarker);

    done();
  });
});
