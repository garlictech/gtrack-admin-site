import * as L from 'leaflet';
import _cloneDeep from 'lodash-es/cloneDeep';
import _flatten from 'lodash-es/flatten';
import _get from 'lodash-es/get';
import _isEmpty from 'lodash-es/isEmpty';
import _map from 'lodash-es/map';
import { Observable, Subject } from 'rxjs';
import { filter, map as rxjsMap, take, takeUntil } from 'rxjs/operators';

import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { HikeProgramStop } from '@bit/garlictech.angular-features.common.gtrack-interfaces';

import { Center, LayerDef } from '@bit/garlictech.angular-features.common.leaflet-map/interfaces';
import { DescriptionLanguageListService } from '@bit/garlictech.angular-features.common.multi-language-text';
import { CheckpointMarkerCollection } from '@features/common/checkpoints/lib/checkpoint-marker-collection';
import { GeoPosition, selectCurrentLocation } from '@features/common/current-geolocation';
import { PoiData } from '@features/common/gtrack-interfaces';


import { faCrosshairs, faSyncAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { select, Store } from '@ngrx/store';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { lineString as turfLineString, point as turfPoint } from '@turf/helpers';
import nearestPointOnLine from '@turf/nearest-point-on-line';
import transformScale from '@turf/transform-scale';

import {
  LeafletIconService,
  LeafletMapMarkerService,
  LeafletMapService,
  LeafletMarkerPopupService
} from '@bit/garlictech.angular-features.common.leaflet-map';
import { LeafletMapMarker } from '@bit/garlictech.angular-features.common.leaflet-map/services/lib';
import { HikeProgram } from '../../services/hike-program';
import { Route } from '../../services/route';
import { PoiSelectors, RouteSelectors } from '../../store';
import * as poiActions from '../../store/poi/actions';
import * as routeActions from '../../store/route/actions';
import { LeafletMapComponent } from '@bit/garlictech.angular-features.common.leaflet-map/components/leaflet-map';

@Component({
  selector: 'gtrack-common-trail-box',
  template: ''
})
export class TrailBoxComponent implements AfterViewInit, OnInit, OnChanges, OnDestroy {
  faCrosshairs: IconDefinition;
  faSyncAlt: IconDefinition;

  layers: Array<LayerDef>;
  center: Center;

  offlineMap: boolean;

  @Input() hikeProgram: HikeProgram;

  @Output() readonly elevationLineOver: EventEmitter<void>;
  @Output() readonly elevationLineMove: EventEmitter<GeoJSON.Position>;
  @Output() readonly elevationLineOut: EventEmitter<void>;
  @Output() readonly elevationLineClick: EventEmitter<{
    position: GeoJSON.Position;
    forced?: boolean;
  }>;

  @Input() elevationMarkerPosition: GeoJSON.Position;
  @Input() elevationMarkerVisible: boolean;
  @Input() elevationMarkerLocked: boolean;

  @ViewChild('map') map: LeafletMapComponent;

  route: Route;

  markerOn: boolean;

  route$: Observable<Route | undefined>;
  pois$: Observable<Array<PoiData>>;

  checkpointsOnly: boolean;

  protected _geoJsons: Array<Array<L.GeoJSON>>;
  protected _elevationZoneHover: boolean;

  private _checkpointMarkerCollection: CheckpointMarkerCollection;
  private _runningElevationPointMarker: L.Marker;

  private _markers: Array<LeafletMapMarker>;
  private _markersGroup: L.LayerGroup;

  private readonly _destroy$: Subject<boolean>;

  constructor(
    private readonly _store: Store<any>,
    private readonly _poiSelectors: PoiSelectors,
    private readonly _routeSelectors: RouteSelectors,
    private readonly _leafletMapService: LeafletMapService,
    private readonly _leafletIconService: LeafletIconService,
    private readonly _leafletMapMarkerService: LeafletMapMarkerService,
    private readonly _descriptionLanguageList: DescriptionLanguageListService,
    private readonly _leafletMarkerPopupService: LeafletMarkerPopupService
  ) {
    this.faCrosshairs = faCrosshairs;
    this.faSyncAlt = faSyncAlt;

    this.layers = [
      {
        name: 'street',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      },
      {
        name: 'topo',
        url: 'https://opentopomap.org/{z}/{x}/{y}.png'
      }
    ];

    this.center = {
      lat: 51.505,
      lng: -0.09,
      zoom: 14
    };

    this.offlineMap = false;

    this.elevationLineOver = new EventEmitter<void>();
    this.elevationLineMove = new EventEmitter<GeoJSON.Position>();
    this.elevationLineOut = new EventEmitter<void>();
    this.elevationLineClick = new EventEmitter<{
      position: GeoJSON.Position;
      forced?: boolean;
    }>();

    this.elevationMarkerPosition = [0, 0];
    this.elevationMarkerVisible = false;
    this.elevationMarkerLocked = false;

    this.markerOn = false;
    this.checkpointsOnly = false;
    this._geoJsons = [];
    this._elevationZoneHover = false;

    this._markers = [];
    this._markersGroup = new L.LayerGroup();

    this._destroy$ = new Subject<boolean>();
  }

  ngOnInit(): void {
    const pois = this.hikeProgram.stops.filter(stop => !/^endpoint/.test(stop.poiId)).map(stop => stop.poiId);
    const route = this.hikeProgram.routeId;

    this.pois$ = this._store.pipe(select(this._poiSelectors.getPois(pois)));
    this.route$ = this._store.pipe(
      select(this._routeSelectors.getRoute(route)),
      rxjsMap(data => {
        if (data) {
          return new Route(data);
        }
      })
    );

    this._store
      .pipe(
        select(this._poiSelectors.getPoiContextEntities(pois)),
        take(1)
      )
      .subscribe(contexts => {
        const notLoaded = pois
          .filter(id => !/^endpoint/.test(id))
          .filter(id => {
            const context = contexts[id];
            const loaded = _get(context, 'loaded', false);
            const loading = _get(context, 'loading', false);

            return !loaded && !loading;
          });

        if (notLoaded.length > 0) {
          this._store.dispatch(new poiActions.LoadPois(notLoaded));
        }
      });

    this._store.pipe(select(this._routeSelectors.getRouteContext(route))).subscribe(context => {
      if (typeof context === 'undefined' || (!context.loaded && !context.loading)) {
        this._store.dispatch(new routeActions.LoadRoute(route));
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (typeof changes.elevationMarkerVisible !== 'undefined') {
      const markerVisible = changes.elevationMarkerVisible;
      this._showElavationPointMarker(markerVisible.currentValue);
    }

    if (typeof changes.elevationMarkerPosition !== 'undefined') {
      this._moveElavationPointMarker(changes.elevationMarkerPosition.currentValue);
    }

    if (typeof changes.elevationMarkerLocked !== 'undefined' && this.map.leafletMap) {
      const locked = changes.elevationMarkerLocked.currentValue;

      if (locked === true) {
        this.map.leafletMap.setView(
          [this.elevationMarkerPosition[1], this.elevationMarkerPosition[0]],
          this.center.zoom
        );
      } else {
        this.resetMap();
      }
    }
  }

  ngAfterViewInit(): void {
    this._checkpointMarkerCollection = new CheckpointMarkerCollection(this.map.leafletMap, this._leafletIconService);

    this.route$
      .pipe(
        filter((route: Route) => typeof route !== 'undefined'),
        takeUntil(this._destroy$)
      )
      .subscribe((route: Route) => {
        this.route = route;
        this.clearGeoJson();

        const feature: GeoJSON.Feature<GeoJSON.LineString> = { ...route.geojson.features[0] };

        feature.properties = {
          draw_type: `route_1`
        };

        this.addGeoJson(feature, this.map.leafletMap);

        setTimeout(() => {
          this._leafletMapService.fitRouteBounds(route);
        }, 100);

        const bounds = bbox(feature);
        const rectangle = transformScale(bboxPolygon(bounds), 1.3);

        this.map.leafletMap.on('mousemove', (e: L.LeafletMouseEvent) => {
          const point = turfPoint([e.latlng.lng, e.latlng.lat]);

          if (booleanPointInPolygon(point, rectangle)) {
            const line = turfLineString(feature.geometry.coordinates);
            const nearest = nearestPointOnLine(line, point);

            if (!this._elevationZoneHover) {
              this._elevationZoneHover = true;
              this.elevationLineOver.emit();
            }

            this.elevationLineMove.emit([nearest.geometry.coordinates[0], nearest.geometry.coordinates[1]]);
          } else {
            if (this._elevationZoneHover) {
              this.elevationLineOut.emit();
              this._elevationZoneHover = false;
            }
          }
        });

        this.map.leafletMap.on('click', (e: L.LeafletMouseEvent) => {
          const point = turfPoint([e.latlng.lng, e.latlng.lat]);

          if (booleanPointInPolygon(point, rectangle)) {
            const line = turfLineString(feature.geometry.coordinates);
            const nearest = nearestPointOnLine(line, point);
            this.elevationLineClick.emit({
              position: [nearest.geometry.coordinates[0], nearest.geometry.coordinates[1]]
            });
          }
        });

        this.map.leafletMap.on('gcmarkerclick', (e: L.LeafletMouseEvent) => {
          const point = turfPoint([e.latlng.lng, e.latlng.lat]);
          const line = turfLineString(feature.geometry.coordinates);
          const nearest = nearestPointOnLine(line, point);
          this.elevationLineClick.emit({
            position: [nearest.geometry.coordinates[0], nearest.geometry.coordinates[1]],
            forced: true
          });
        });

        this.map.leafletMap.on('mouseout', () => {
          if (this._elevationZoneHover) {
            this.elevationLineOut.emit();
            this._elevationZoneHover = false;
          }
        });
      });

    this.pois$
      .pipe(
        filter(pois => !_isEmpty(pois)),
        take(1)
      )
      .subscribe(pois => {
        this._leafletMapService.removeLayer(this._markersGroup);

        this._markers = this._generateMarkers(pois, this.hikeProgram.stops);

        this._markersGroup = this._leafletMapService.createMarkersGroup(_map(this._markers, 'marker'));
        this._leafletMapService.addLayer(this._markersGroup);
      });

    this._checkpointMarkerCollection.removeCheckpointMarkers();
    this._checkpointMarkerCollection.addCheckpointMarkers(this.hikeProgram.checkpoints.checkpoints);

    this._runningElevationPointMarker = new L.Marker(
      [this.elevationMarkerPosition[1], this.elevationMarkerPosition[0]],
      {
        opacity: 0,
        zIndexOffset: 1000,
        icon: new L.Icon({
          // tslint:disable:no-require-imports
          iconUrl: require('leaflet/dist/images/marker-icon.png'),
          iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
          shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
          // tslint:enable:no-require-imports
          iconSize: [25, 41],
          shadowSize: [41, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          tooltipAnchor: [16, -28]
        })
      }
    );

    this._runningElevationPointMarker.addTo(this.map.leafletMap);
    this._showElavationPointMarker(this.elevationMarkerVisible);
  }

  ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  addGeoJson(geojson: any, map: L.Map): void {
    const styles = [
      { color: 'black', opacity: 0.1, weight: 20 },
      { color: 'black', opacity: 0.2, weight: 16 },
      { color: 'black', opacity: 0.3, weight: 12 },
      { color: 'white', opacity: 1, weight: 9 },
      { color: 'red', opacity: 1, weight: 4 }
    ];

    const responses = styles.map((style, i) =>
      L.geoJSON(geojson, {
        style: () => style
      })
    );

    for (const response of responses) {
      response.addTo(map);
    }

    this._geoJsons.push(responses);
  }

  clearGeoJson(): void {
    _flatten(this._geoJsons).forEach(geojson => geojson.clearLayers());
    this._geoJsons = [];
  }

  goToCurrentPosition(e: Event): void {
    e.preventDefault();

    this._store
      .pipe(
        select(selectCurrentLocation),
        take(1)
      )
      .subscribe((position: GeoPosition) => {
        if (position && position.coords) {
          const latLng = L.latLng(position.coords.latitude, position.coords.longitude);
          this.map.currentPositionMarker.goToPosition(latLng);
        }
      });
  }

  resetMap(e?: Event): void {
    if (e) {
      e.preventDefault();
    }

    if (this.route) {
      this._leafletMapService.fitRouteBounds(this.route);
    }
  }

  showCheckpointsOnly(e: Event): void {
    e.preventDefault();

    if (this.hikeProgram) {
      const checkpoints = this.hikeProgram.checkpoints.checkpoints;

      if (!this.checkpointsOnly) {
        this.checkpointsOnly = true;
        this._leafletMapService.removeLayer(this._markersGroup);
        this._checkpointMarkerCollection.showMarkers(checkpoints, true);
      }
    }
  }

  showAllPoints(e: Event): void {
    e.preventDefault();

    if (this.hikeProgram) {
      const checkpoints = this.hikeProgram.checkpoints.checkpoints;

      if (this.checkpointsOnly) {
        this.checkpointsOnly = false;
        this._leafletMapService.addLayer(this._markersGroup);
        this._checkpointMarkerCollection.showMarkers(checkpoints, false);
      }
    }
  }

  protected _showElavationPointMarker(show = true): void {
    const opacity = show ? 1 : 0;

    if (this._runningElevationPointMarker) {
      this._runningElevationPointMarker.setOpacity(opacity);
    }
  }

  protected _moveElavationPointMarker(position: GeoJSON.Position): void {
    if (this._runningElevationPointMarker) {
      this._runningElevationPointMarker.setLatLng([position[1], position[0]]);
    }
  }

  private _generateMarkers(pois: Array<PoiData>, stops: Array<HikeProgramStop> = []): Array<LeafletMapMarker> {
    const _markers = [];

    pois.forEach((poi, i) => {
      const description = this._descriptionLanguageList.getLocalizedDescription(poi.description);
      const poiStop = stops.find(stop => stop.poiId === poi.id);

      const popupData = {
        popupComponentName: 'MarkerPopupComponent',
        markerClickCallback: this._leafletMarkerPopupService.onUserMarkerClick,
        closeCallback: () => {
          this.map.leafletMap.closePopup();
        },
        map: this.map.leafletMap,
        data: {
          poi: _cloneDeep(poi),
          stop: poiStop
        }
      };

      const marker = this._leafletMapMarkerService.create(
        poi.lat,
        poi.lon,
        poi.types,
        _get(description, 'title', ''),
        undefined,
        popupData
      );
      _markers.push(marker);
    });

    return _markers;
  }
}
