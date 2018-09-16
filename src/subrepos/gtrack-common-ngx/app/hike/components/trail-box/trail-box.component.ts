import { take, map as rxjsMap, filter, takeUntil } from 'rxjs/operators';

import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { faCrosshairs, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

import { Store, select } from '@ngrx/store';
import * as _ from 'lodash';

import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import transformScale from '@turf/transform-scale';
import nearestPointOnLine from '@turf/nearest-point-on-line';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point as turfPoint, lineString as turfLineString } from '@turf/helpers';

import { HikeProgram } from '../../services/hike-program';

import { PoiSelectors, RouteSelectors } from '../../store';

import * as poiActions from '../../store/poi/actions';
import * as routeActions from '../../store/route/actions';

import { Route } from '../../services/route';

import { LeafletComponent, Center } from '../../../map';

import * as L from 'leaflet';
import { Observable, Subject } from 'rxjs';
import { IPoi } from '../../../../../provider-client';

@Component({
  selector: 'gtcn-trail-box',
  template: ''
})
export class TrailBoxComponent implements AfterViewInit, OnInit, OnChanges, OnDestroy {
  faCrosshairs = faCrosshairs;
  faSyncAlt = faSyncAlt;

  public layers = [
    {
      name: 'street',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    },
    {
      name: 'topo',
      url: 'https://opentopomap.org/{z}/{x}/{y}.png'
    }
  ];

  public center = <Center>{
    lat: 51.505,
    lng: -0.09,
    zoom: 14
  };

  public offlineMap = false;

  @Input()
  public hikeProgram: HikeProgram;

  @Output()
  public elevationLineOver = new EventEmitter<void>();

  @Output()
  public elevationLineMove = new EventEmitter<GeoJSON.Position>();

  @Output()
  public elevationLineOut = new EventEmitter<void>();

  @Output()
  public elevationLineClick = new EventEmitter<GeoJSON.Position>();

  @Input()
  public elevationMarkerPosition: GeoJSON.Position = [0, 0];

  @Input()
  public elevationMarkerVisible = false;

  @ViewChild('map')
  public map: LeafletComponent;

  public route: Route;

  public markerOn = false;

  public route$: Observable<Route | undefined>;
  public pois$: Observable<IPoi[]>;

  public checkpointsOnly = false;

  protected _geoJsons: L.GeoJSON[][] = [];
  protected _elevationZoneHover = false;

  private _destroy$: Subject<boolean> = new Subject<boolean>();
  private _runningElevationPointMarker: L.Marker;

  public constructor(
    private _store: Store<any>,
    private _poiSelectors: PoiSelectors,
    private _routeSelectors: RouteSelectors
  ) {}

  ngOnInit() {
    const pois = this.hikeProgram.stops.filter(stop => !/^endpoint/.test(stop.poiId)).map(stop => stop.poiId);
    const route = this.hikeProgram.routeId;

    this.pois$ = this._store.pipe(select(this._poiSelectors.getPois(pois)));
    this.route$ = this._store
      .pipe(
        select(this._routeSelectors.getRoute(route)),
        rxjsMap(data => {
          if (data) {
            return new Route(data);
          }
        })
      );

    this._store.dispatch(new poiActions.LoadPois(pois));

    this._store
      .pipe(
        select(this._routeSelectors.getRouteContext(route))
      )
      .subscribe(context => {
        if (typeof context === 'undefined' || (context.loaded !== true && context.loading !== true)) {
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
  }

  ngAfterViewInit() {
    const map = this.map.map;

    this.route$
      .pipe(
        filter((route: Route) => typeof route !== 'undefined'),
        takeUntil(this._destroy$)
      )
      .subscribe((route: Route) => {
        this.route = route;
        this.clearGeoJson();

        const feature = Object.assign({}, route.geojson.features[0]) as GeoJSON.Feature<GeoJSON.LineString>;

        feature.properties = {
          draw_type: `route_1`
        };

        this.addGeoJson(feature, map.leafletMap);

        setTimeout(() => {
          map.fitBounds(route);
        }, 100);

        const bounds = bbox(feature);
        const rectangle = transformScale(bboxPolygon(bounds), 1.3);

        this.map.leafletMap.on('mousemove', (e: L.LeafletMouseEvent) => {
          const point = turfPoint([e.latlng.lng, e.latlng.lat]);

          if (booleanPointInPolygon(point, rectangle)) {
            const line = turfLineString(feature.geometry.coordinates);
            const nearest = nearestPointOnLine(line, point);

            if (this._elevationZoneHover === false) {
              this._elevationZoneHover = true;
              this.elevationLineOver.emit();
            }

            this.elevationLineMove.emit([nearest.geometry.coordinates[0], nearest.geometry.coordinates[1]]);
          } else {
            if (this._elevationZoneHover === true) {
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
            this.elevationLineClick.emit([nearest.geometry.coordinates[0], nearest.geometry.coordinates[1]]);
          }
        });

        this.map.leafletMap.on('mouseout', () => {
          if (this._elevationZoneHover === true) {
            this.elevationLineOut.emit();
            this._elevationZoneHover = false;
          }
        });
      });

    this.pois$
      .pipe(
        filter(pois => !_.isEmpty(pois)),
        take(1)
      )
      .subscribe(pois => {
        map.pointMarker.removeMarkers();
        map.pointMarker.addMarkers(pois, this.hikeProgram.stops);
      });

    map.checkpointMarker.removeCheckpointMarkers();
    map.checkpointMarker.addCheckpointMarkers(this.hikeProgram.checkpoints.checkpoints);
    map.pointMarker.addMarkersToMap();

    this._runningElevationPointMarker = new L.Marker(
      [this.elevationMarkerPosition[1], this.elevationMarkerPosition[0]],
      {
        opacity: 0,
        zIndexOffset: 1000,
        icon: new L.Icon({
          iconUrl: require('leaflet/dist/images/marker-icon.png'),
          iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
          shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
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

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  addGeoJson(geojson: any, map: L.Map) {
    const styles = [
      { color: 'black', opacity: 0.15, weight: 9 },
      { color: 'white', opacity: 0.8, weight: 6 },
      { color: 'red', opacity: 1, weight: 2 }
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

  clearGeoJson() {
    _.flatten(this._geoJsons).forEach(geojson => geojson.clearLayers());
    this._geoJsons = [];
  }

  goToCurrentPosition(e: Event) {
    e.preventDefault();
    const map = this.map.map;
    map.currentPositionMarker.goToCurrentPosition();
  }

  resetMap(e: Event) {
    e.preventDefault();
    const map = this.map.map;

    if (this.route) {
      map.fitBounds(this.route);
    }
  }

  showCheckpointsOnly(e: Event) {
    e.preventDefault();
    const map = this.map.map;

    if (this.hikeProgram) {
      const checkpoints = this.hikeProgram.checkpoints.checkpoints;

      if (this.checkpointsOnly === false) {
        this.checkpointsOnly = true;
        map.pointMarker.removeMarkersFromMap();
        map.checkpointMarker.showMarkers(checkpoints, true);
      }
    }
  }

  showAllPoints(e: Event) {
    e.preventDefault();
    const map = this.map.map;

    if (this.hikeProgram) {
      const checkpoints = this.hikeProgram.checkpoints.checkpoints;

      if (this.checkpointsOnly === true) {
        this.checkpointsOnly = false;
        map.pointMarker.addMarkersToMap();
        map.checkpointMarker.showMarkers(checkpoints, false);
      }
    }
  }

  protected _showElavationPointMarker(show = true) {
    const opacity = show === true ? 1 : 0;

    if (this._runningElevationPointMarker) {
      this._runningElevationPointMarker.setOpacity(opacity);
    }
  }

  protected _moveElavationPointMarker(position: GeoJSON.Position) {
    if (this._runningElevationPointMarker) {
      this._runningElevationPointMarker.setLatLng([position[1], position[0]]);
    }
  }
}
