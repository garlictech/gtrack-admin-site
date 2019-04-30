import * as L from 'leaflet';
import _cloneDeep from 'lodash-es/cloneDeep';
import _flatten from 'lodash-es/flatten';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map as rxjsMap, take, takeUntil, tap } from 'rxjs/operators';

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
import { GeoPosition, selectCurrentLocation } from '@bit/garlictech.angular-features.common.current-geolocation';
import { GeometryService } from '@bit/garlictech.angular-features.common.geometry';
import { LeafletMapComponent } from '@bit/garlictech.angular-features.common.leaflet-map/components/leaflet-map';
import {
  Center,
  LayerDef,
  LeafletMarkerPopupData
} from '@bit/garlictech.angular-features.common.leaflet-map/interfaces';
import {
  LeafletMapMarkerService,
  LeafletMapService,
  LeafletMarkerPopupService
} from '@bit/garlictech.angular-features.common.leaflet-map/services';
import { LeafletMapMarker } from '@bit/garlictech.angular-features.common.leaflet-map/services/lib';
import { RouteSelectors } from '@bit/garlictech.angular-features.common.route';
import { Route } from '@bit/garlictech.angular-features.common.route/services/route';
import * as routeActions from '@bit/garlictech.angular-features.common.route/store/actions';
import { select, Store } from '@ngrx/store';

import { HikeProgram } from '../../lib';

@Component({
  selector: 'gtrack-common-hike-list-map',
  template: ''
})
export class HikeListMapComponent implements AfterViewInit, OnInit, OnChanges, OnDestroy {
  layers: Array<LayerDef>;

  center: Center;

  @Input() hikePrograms$: Observable<Array<HikeProgram>>;
  @Input() highlighted: HikeProgram;
  @Output() readonly hikeClick: EventEmitter<HikeProgram>;

  @ViewChild('map') map: LeafletMapComponent;

  routes: Array<Route>;

  routes$: Observable<Array<Route> | undefined>;
  routeIds$: Observable<Array<string>>;

  protected _geoJsons: Array<Array<L.GeoJSON>>;
  protected _destroy$: Subject<boolean>;
  protected _markers: Array<LeafletMapMarker>;

  constructor(
    protected _store: Store<any>,
    protected _routeSelectors: RouteSelectors,
    protected _leafletMapService: LeafletMapService,
    protected _mapMarker: LeafletMapMarkerService,
    protected _geometry: GeometryService,
    protected _leafletMarkerPopupService: LeafletMarkerPopupService
  ) {
    this.hikeClick = new EventEmitter<HikeProgram>();
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
    this._markers = [];
  }

  ngOnInit(): void {
    const routeIds$ = this.hikePrograms$.pipe(
      takeUntil(this._destroy$),
      rxjsMap(hikePrograms => hikePrograms.map(hikeProgram => hikeProgram.routeId))
    );

    const routes$ = this._store.pipe(select(this._routeSelectors.getAllRoutes));

    const routeContexts$ = this._store.pipe(select(this._routeSelectors.getAllContexts));

    this.routes$ = combineLatest(routeIds$, routes$, routeContexts$).pipe(
      tap(([routeIds, routes, contexts]) => {
        for (const route of routeIds) {
          const routeContext = contexts.find(context => context.id === route);

          if (typeof routeContext === 'undefined' || (!routeContext.loaded && !routeContext.loading)) {
            this._store.dispatch(new routeActions.LoadRoute(route));
          }
        }
      }),
      rxjsMap(([routeIds, routes]) => routes.filter(route => (route.id ? routeIds.indexOf(route.id) !== -1 : false))),
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
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.highlighted) {
      this.highlightMarker(this.highlighted);
    }
  }

  highlightMarker(hikeProgram?: HikeProgram): void {
    let others = this._markers;
    let activeMarker: LeafletMapMarker | undefined;

    if (hikeProgram && hikeProgram.id) {
      const id = hikeProgram.id;

      activeMarker = this._markers.find(marker => marker.popupData.data.hikeProgram.id === id);
      others = this._markers.filter(marker => marker.popupData.data.hikeProgram.id !== id);
    }

    others.forEach(marker => marker.removeHighlight());

    if (activeMarker) {
      activeMarker.addHighlight();
    }
  }

  centerMap(): void {
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
      this._markers.forEach(marker => marker.removeFromMap(this.map.leafletMap));
      this._markers = [];

      for (const hikeProgram of hikePrograms) {
        let marker: LeafletMapMarker | undefined;

        const popupData = {
          popupComponentName: 'HikeDataPopupComponent',
          markerClickCallback: (
            clickedMarker: L.Marker,
            markerPopupData: LeafletMarkerPopupData,
            e: L.LeafletMouseEvent
          ) => {
            this._leafletMarkerPopupService.onUserMarkerClick(clickedMarker, markerPopupData, e).subscribe(popup => {
              const content = popup.getContent();

              popup.on('remove', () => {
                console.log('remove');
                marker.removeHighlight();
              });

              if (marker) {
                marker.addHighlight();
              }

              if (content instanceof HTMLElement) {
                L.DomEvent.addListener(content, 'click', () => {
                  this.hikeClick.emit(markerPopupData.data.hikeProgram);
                });
              }
            });
          },
          closeCallback: () => {
            this.map.leafletMap.closePopup();
          },
          map: this.map.leafletMap,
          data: {
            hikeProgram: _cloneDeep(hikeProgram)
          },
          width: 300,
          className: 'search-hike-data'
        };

        marker = this._mapMarker.create(
          hikeProgram.stops[0].lat,
          hikeProgram.stops[0].lon,
          ['hiking'],
          hikeProgram.title,
          undefined,
          popupData
        );

        this._markers.push(marker);

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
    this.centerMap();
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
