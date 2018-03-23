import {
  Component,
  Input,
  ViewChild,
  AfterViewInit,
  ViewEncapsulation,
  OnInit,
  OnDestroy
} from '@angular/core';

import { Store } from '@ngrx/store';
import * as _ from 'lodash';

import { HikeProgram } from '../../services/hike-program';

import {
  PoiSelectors,
  RouteSelectors
} from '../../store';

import * as poiActions from '../../store/poi/actions';
import * as routeActions from '../../store/route/actions';

import { Route } from '../../services/route';

import { Poi } from '../../services/poi';
import { LeafletComponent, Center } from '../../../map';

import * as L from 'leaflet';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'gc-trail-box',
  templateUrl: './trail-box.component.html',
  styleUrls: ['./trail-box.component.scss']
})
export class TrailBoxComponent implements AfterViewInit, OnInit, OnDestroy {
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
  }

  public offlineMap = false;

  @Input()
  public hikeProgram: HikeProgram;

  @ViewChild('map')
  public map: LeafletComponent;

  public route: Route;

  public route$: Observable<Route | undefined>;
  public pois$: Observable<Poi[]>;

  public checkpointsOnly = false;
  protected _geoJsons: L.GeoJSON[] = [];
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  public constructor(
    private _store: Store<any>,
    private _poiSelectors: PoiSelectors,
    private _routeSelectors: RouteSelectors
  ) {}

  ngOnInit() {
    let pois = this.hikeProgram.stops.map(stop => stop.poiId);
    let route = this.hikeProgram.routeId;

    this.pois$ = this._store.select(this._poiSelectors.getPois(pois));
    this.route$ = this._store.select(this._routeSelectors.getRoute(route));

    this._store.dispatch(new poiActions.LoadPois(pois));
    this._store.dispatch(new routeActions.LoadRoute(route));
  }

  ngAfterViewInit() {
    let map = this.map.map;

    this.route$
      .filter((route: Route) => (typeof route !== 'undefined'))
      .takeUntil(this._destroy$)
      .subscribe((route: Route) => {
        this.route = route;
        this.clearGeoJson();

        for (let i = 0; i <= 2; i++) {
          let feature = Object.assign({}, route.geojson.features[0]);

          feature.properties = {
            draw_type: `route_${i}`
          };

          this.addGeoJson(feature, map.leafletMap);
        }

        map.fitBounds(route);
      });

    this
      .pois$
      .filter(pois => (!_.isEmpty(pois)))
      .take(1)
      .subscribe(pois => {
        map.pointMarker.removeMarkers();
        map.pointMarker.addMarkers(pois);
      });

    map.checkpointMarker.removeCheckpointMarkers();
    map.checkpointMarker.addCheckpointMarkers(this.hikeProgram.checkpoints.checkpoints);
    map.pointMarker.addMarkersToMap();
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  addGeoJson(geojson: any, map: L.Map) {
    let response = L.geoJSON(geojson, {
      style: () => ({
        color: 'red',
        opacity: 1,
        weight: 2
      })
    });

    response.addTo(map);
    this._geoJsons.push(response);
  }

  clearGeoJson() {
    this._geoJsons.forEach(geojson => geojson.clearLayers());
    this._geoJsons = [];
  }

  goToCurrentPosition(e: Event) {
    e.preventDefault();
    let map = this.map.map;
    map.currentPositionMarker.goToCurrentPosition();
  }

  resetMap(e: Event) {
    e.preventDefault();
    let map = this.map.map;

    if (this.route) {
      map.fitBounds(this.route);
    }
  }

  showCheckpointsOnly(e: Event) {
    e.preventDefault();
    let map = this.map.map;

    if (this.hikeProgram) {
      let checkpoints = this.hikeProgram.checkpoints.checkpoints;

      if (this.checkpointsOnly === false) {
        this.checkpointsOnly = true;
        map.pointMarker.removeMarkersFromMap();
        map.checkpointMarker.showMarkers(checkpoints, true);
      }
    }
  }

  showAllPoints(e: Event) {
    e.preventDefault();
    let map = this.map.map;

    if (this.hikeProgram) {
      let checkpoints = this.hikeProgram.checkpoints.checkpoints;

      if (this.checkpointsOnly === true) {
        this.checkpointsOnly = false;
        map.pointMarker.addMarkersToMap();
        map.checkpointMarker.showMarkers(checkpoints, false);
      }
    }
  }

}
