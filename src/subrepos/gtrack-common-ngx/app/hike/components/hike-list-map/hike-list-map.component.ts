import * as L from 'leaflet';
import _flatten from 'lodash-es/flatten';
import { Observable, Subject } from 'rxjs';
import { map as rxjsMap, take, takeUntil } from 'rxjs/operators';

import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LeafletMapMarkerService, LeafletMapService } from '@bit/garlictech.angular-features.common.leaflet-map';
import { LeafletMapComponent } from '@bit/garlictech.angular-features.common.leaflet-map/components/leaflet-map';
import { Center, LayerDef } from '@bit/garlictech.angular-features.common.leaflet-map/interfaces';
import { GeoPosition, selectCurrentLocation } from '@features/common/current-geolocation';
import { select, Store } from '@ngrx/store';

import { GeometryService } from '../../services/geometry';
import { HikeProgram } from '../../services/hike-program';
import { Route } from '../../services/route';
import { RouteSelectors } from '../../store';
import * as routeActions from '../../store/route/actions';

@Component({
  selector: 'gtrack-common-hike-list-map',
  template: ''
})
export class HikeListMapComponent implements AfterViewInit, OnInit, OnDestroy {
  layers: Array<LayerDef>;

  center: Center;

  @Input() hikePrograms$: Observable<Array<HikeProgram>>;

  @ViewChild('map') map: LeafletMapComponent;

  routes: Array<Route>;

  routes$: Observable<Array<Route> | undefined>;

  protected _geoJsons: Array<Array<L.GeoJSON>>;
  protected _destroy$: Subject<boolean>;

  constructor(
    protected _store: Store<any>,
    protected _routeSelectors: RouteSelectors,
    protected _leafletMapService: LeafletMapService,
    protected _mapMarker: LeafletMapMarkerService,
    protected _geometry: GeometryService
  ) {
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
      lat: 47.497912,
      lng: 19.040235,
      zoom: 14
    };

    this._geoJsons = [];
    this._destroy$ = new Subject<boolean>();
  }

  ngOnInit(): void {
    this.hikePrograms$.pipe(takeUntil(this._destroy$)).subscribe(hikePrograms => {
      const routes = hikePrograms.map(hikeProgram => hikeProgram.routeId);

      this.routes$ = this._store.pipe(
        select(this._routeSelectors.getRoutes(routes)),
        rxjsMap(data => {
          if (data) {
            return data
              .map(routeData => {
                if (routeData) {
                  return new Route(routeData);
                }
              })
              .filter(route => typeof route !== 'undefined');
          }
        })
      );

      this._store.pipe(select(this._routeSelectors.getRouteContexts(routes))).subscribe(contexts => {
        for (const route of routes) {
          const routeContext = contexts.find(context => context.id === route);

          if (typeof routeContext === 'undefined' || (!routeContext.loaded && !routeContext.loading)) {
            this._store.dispatch(new routeActions.LoadRoute(route));
          }
        }
      });
    });
  }

  protected _centerMap(): void {
    this.hikePrograms$.pipe(takeUntil(this._destroy$)).subscribe(hikePrograms => {
      const points: Array<GeoJSON.Position> = hikePrograms.map(hikeProgram => [
        hikeProgram.stops[0].lon,
        hikeProgram.stops[0].lat
      ]);

      const envelope = this._geometry.doEnvelope(points);
      const southWest = new L.LatLng(envelope[0][0], envelope[0][1]);
      const northEast = new L.LatLng(envelope[1][0], envelope[1][1]);
      const box = new L.LatLngBounds(southWest, northEast);

      this._leafletMapService.fitBounds(box);
    });
  }

  protected _addHikesToTheMap(): void {
    const map = this.map;

    this.hikePrograms$.pipe(takeUntil(this._destroy$)).subscribe(hikePrograms => {
      for (const hikeProgram of hikePrograms) {
        const marker = this._mapMarker.create(
          hikeProgram.stops[0].lat,
          hikeProgram.stops[0].lon,
          ['hiking'],
          hikeProgram.title
        );

        marker.addToMap(this.map.leafletMap);
      }
    });

    this.routes$.pipe(takeUntil(this._destroy$)).subscribe((routes: Array<Route>) => {
      this.routes = routes;
      this.clearGeoJson();

      for (const route of routes) {
        for (let i = 0; i <= 2; i++) {
          const feature = { ...route.geojson.features[0] };

          feature.properties = {
            draw_type: `route_${i}`
          };

          this.addGeoJson(feature, map.leafletMap);
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this._addHikesToTheMap();
    this._centerMap();
  }

  ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  addGeoJson(geojson: any, map: L.Map): void {
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
}
