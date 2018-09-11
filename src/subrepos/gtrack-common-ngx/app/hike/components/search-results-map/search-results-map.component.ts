import { Component, Input, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';

import { HikeProgram } from '../../services/hike-program';
import { GeometryService } from '../../services/geometry';

import { PoiSelectors, RouteSelectors } from '../../store';
import * as routeActions from '../../store/route/actions';
import { Route } from '../../services/route';
import { LeafletComponent, Center, MapMarkerService, MapMarker } from '../../../map';

import * as L from 'leaflet';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';

@Component({
  selector: 'gc-search-results-map',
  template: ''
})
export class SearchResultsMapComponent implements AfterViewInit, OnInit, OnDestroy {
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
    lat: 47.497912,
    lng: 19.040235,
    zoom: 14
  };

  @Input()
  public circle: {
    lat: number;
    lng: number;
    radius: number;
  };

  public offlineMap = false;

  @Input()
  public hikePrograms$: Observable<HikeProgram[]>;

  @ViewChild('map')
  public map: LeafletComponent;

  public routes: Route[];

  public routes$: Observable<Route[] | undefined>;

  protected _geoJsons: L.GeoJSON[][] = [];
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  public constructor(
    private _store: Store<any>,
    private _routeSelectors: RouteSelectors,
    private _mapMarker: MapMarkerService,
    private _geometry: GeometryService
  ) {}

  ngOnInit() {
    this.hikePrograms$.takeUntil(this._destroy$).subscribe(hikePrograms => {
      const routes = hikePrograms.map(hikeProgram => hikeProgram.routeId);

      this.routes$ = this._store.select(this._routeSelectors.getRoutes(routes)).map(data => {
        if (data) {
          return data
            .map(routeData => {
              if (routeData) {
                return new Route(routeData);
              }
            })
            .filter(route => {
              return typeof route !== 'undefined';
            });
        }
      });

      this._store.select(this._routeSelectors.getRouteContexts(routes)).subscribe(contexts => {
        for (const route of routes) {
          const routeContext = contexts.find(context => context.id === route);

          if (typeof routeContext === 'undefined' || (routeContext.loaded !== true && routeContext.loading !== true)) {
            this._store.dispatch(new routeActions.LoadRoute(route));
          }
        }
      });
    });
  }

  ngAfterViewInit() {
    const map = this.map.map;

    const envelope = this._geometry.envelopeCircle([this.circle.lng, this.circle.lat], this.circle.radius);
    const southWest = new L.LatLng(envelope[0][0], envelope[0][1]);
    const northEast = new L.LatLng(envelope[1][0], envelope[1][1]);
    const box = new L.LatLngBounds(southWest, northEast);

    const circle = new L.Circle(
      {
        lat: this.circle.lat,
        lng: this.circle.lng
      },
      this.circle.radius
    );

    circle.addTo(map.leafletMap);

    map.fitBox(box);

    this.hikePrograms$.takeUntil(this._destroy$).subscribe(hikePrograms => {
      const markers: GeoJSON.Position[] = [];

      for (const hikeProgram of hikePrograms) {
        const marker = this._mapMarker.create(
          hikeProgram.stops[0].lat,
          hikeProgram.stops[0].lon,
          ['hiking'],
          hikeProgram.title
        );
        markers.push([hikeProgram.stops[0].lon, hikeProgram.stops[0].lat]);

        marker.addToMap(this.map.leafletMap);
      }
    });

    this.routes$.takeUntil(this._destroy$).subscribe((routes: Route[]) => {
      this.routes = routes;
      this.clearGeoJson();

      for (const route of routes) {
        for (let i = 0; i <= 2; i++) {
          const feature = Object.assign({}, route.geojson.features[0]);

          feature.properties = {
            draw_type: `route_${i}`
          };

          this.addGeoJson(feature, map.leafletMap);
        }
      }
    });
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  addGeoJson(geojson: any, map: L.Map) {
    const styles = [
      { color: 'black', opacity: 0.1, weight: 8 },
      { color: 'white', opacity: 0.8, weight: 6 },
      { color: 'red', opacity: 1, weight: 2 }
    ];

    const responses = styles.map(style => {
      const response = L.geoJSON(geojson, {
        style: () => style
      });

      response.addTo(map);

      return response;
    });

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
}
