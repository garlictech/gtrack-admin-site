import { GeoJsonObject } from 'geojson';
import * as L from 'leaflet';
import { SelectItem } from 'primeng/api';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { GoogleMapsService } from 'subrepos/gtrack-common-ngx';

import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GeoPosition, selectCurrentLocation } from '@bit/garlictech.angular-features.common.current-geolocation';
import { LeafletMapService } from '@bit/garlictech.angular-features.common.leaflet-map';
import { LeafletMapComponent } from '@bit/garlictech.angular-features.common.leaflet-map/components/leaflet-map';
import { GEOJSON_STYLES } from '@bit/garlictech.angular-features.common.leaflet-map/constants/geojson-styles';
import { Center, LayerDef, LeafletMapConfig } from '@bit/garlictech.angular-features.common.leaflet-map/interfaces';
import { faSearch, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { select, Store } from '@ngrx/store';

import { AdminMapService, EBufferSize, WaypointMarkerService } from '../../../../shared/services/admin-map';
import { State } from '../../../../store';
import { commonBackgroundGeolocationActions } from '../../../../store/actions';
import * as hikeEditRoutePlannerSelectors from '../../../../store/selectors/hike-edit-route-planner';

const CENTER: Center = {
  lat: 47.689714,
  lng: 18.904206,
  zoom: 12
};

const LAYERS: Array<LayerDef> = [
  {
    name: 'street',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  },
  {
    name: 'topo',
    url: 'https://opentopomap.org/{z}/{x}/{y}.png'
  }
];

const OVERLAYS: Array<LayerDef> = [
  {
    name: 'trails',
    url: 'http://tile.lonvia.de/hiking/{z}/{x}/{y}.png'
  }
];

enum EMode {
  ROUTING = 'routing'
}

@Component({
  selector: 'app-hike-edit-map',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class HikeEditMapComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('adminMap') adminMap: LeafletMapComponent;
  center: Center;
  layers: Array<LayerDef>;
  overlays: Array<LayerDef>;
  mapConfig: LeafletMapConfig;
  mode: EMode;
  allowPlanning: boolean;
  currentLocation$: Observable<GeoPosition | null>;
  clickModes: Array<SelectItem>;
  locationSearchResult: google.maps.places.PlaceResult;
  faSearch: IconDefinition;
  // tslint:disable-next-line:no-property-initializers
  EBufferSize = EBufferSize;

  @ViewChild('search') private readonly _searchElementRef: ElementRef;
  private _searchInput: HTMLInputElement;
  private readonly _bufferShown: any;
  private readonly _bufferOnMap: any;
  private readonly _destroy$: Subject<boolean>;

  constructor(
    private readonly _store: Store<State>,
    private readonly _waypointMarkerService: WaypointMarkerService,
    private readonly _adminMapService: AdminMapService,
    private readonly _googleMapsService: GoogleMapsService,
    private readonly _ngZone: NgZone,
    private readonly _leafletMapService: LeafletMapService
  ) {
    this.center = CENTER;
    this.layers = LAYERS;
    this.overlays = OVERLAYS;

    this.mode = EMode.ROUTING;
    this.clickModes = [];

    this.faSearch = faSearch;

    this._bufferShown = {};
    this._bufferOnMap = {};
    this._destroy$ = new Subject<boolean>();
  }

  ngOnInit(): void {
    this.clickModes = [{ label: 'Routing mode', value: 'routing' }, { label: 'Checkpoint mode', value: 'checkpoint' }];

    this.mapConfig = {
      fullScreenControl: {
        forceSeparateButton: true,
        forcePseudoFullscreen: true
      },
      spiderfier: {
        keepSpiderfied: true
      }
    };

    // Update buffer on each segment update
    this._store
      .pipe(
        select(hikeEditRoutePlannerSelectors.getSegments),
        takeUntil(this._destroy$)
      )
      .subscribe(() => {
        // Refresh buffers on segment change, if needed
        setTimeout(() => {
          if (this._bufferShown[EBufferSize.SMALL]) {
            this._removeBuffer(EBufferSize.SMALL);
            this._addBuffer(EBufferSize.SMALL);
          }
          if (this._bufferShown[EBufferSize.BIG]) {
            this._removeBuffer(EBufferSize.BIG);
            this._addBuffer(EBufferSize.BIG);
          }
        });
      });

    this._store
      .pipe(
        select(hikeEditRoutePlannerSelectors.getIsPlanning),
        takeUntil(this._destroy$)
      )
      .subscribe((planning: boolean) => {
        this.allowPlanning = planning;
      });

    this._store.dispatch(new commonBackgroundGeolocationActions.StartPositioning());

    this.currentLocation$ = this._store.pipe(
      select(selectCurrentLocation),
      takeUntil(this._destroy$)
    );

    this._initLocationSearchInput();
  }

  ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();

    this._store.dispatch(new commonBackgroundGeolocationActions.EndPositioning());
  }

  ngAfterViewInit(): void {
    // Disable wheel zoom
    this.adminMap.leafletMap.scrollWheelZoom.disable();
  }

  onMapClick(e: L.LeafletMouseEvent): void {
    if (this.allowPlanning) {
      if (this.mode === 'routing') {
        // tslint:disable-next-line:no-floating-promises
        this._waypointMarkerService.addWaypoints([e.latlng]);
      } else {
        // this._createCheckpoint(e.latlng);
      }
    }
  }

  onMapMouseUp(e: L.LeafletMouseEvent): void {
    // this.adminMap.leafletMap.scrollWheelZoom.enable();
  }

  onMapMouseOut(e: L.LeafletMouseEvent): void {
    // this.adminMap.leafletMap.scrollWheelZoom.disable();
  }

  toggleCurrentPositionMarker($event: Event): void {
    $event.stopPropagation();

    this.currentLocation$.pipe(take(1)).subscribe((position: GeoPosition) => {
      if (position && position.coords) {
        const latLng = L.latLng(position.coords.latitude, position.coords.longitude);
        this.adminMap.currentPositionMarker.goToPosition(latLng);
      }
    });
  }

  resetMap($event: Event): void {
    $event.stopPropagation();
    this._store
      .pipe(
        select(hikeEditRoutePlannerSelectors.getRoute),
        take(1)
      )
      .subscribe((route: any) => {
        const bounds: L.LatLngBoundsExpression = [
          [route.bounds.NorthEast.lat, route.bounds.NorthEast.lon],
          [route.bounds.SouthWest.lat, route.bounds.SouthWest.lon]
        ];

        this._leafletMapService.fitBounds(bounds);
      });
  }

  toggleBuffer($event: Event, size: EBufferSize): void {
    $event.stopPropagation();

    this._bufferShown[size] = !this._bufferShown[size];

    if (this._bufferShown[size]) {
      this._addBuffer(size);
    } else {
      this._removeBuffer(size);
    }
  }

  goToLocation($event): void {
    $event.stopPropagation();

    if (this.locationSearchResult) {
      this._leafletMapService.leafletMap.setView(
        [this.locationSearchResult.geometry.location.lat(), this.locationSearchResult.geometry.location.lng()],
        13
      );
    }
  }

  private _addBuffer(size: EBufferSize): void {
    this._adminMapService
      .getBuffer(size)
      .pipe(take(1))
      .subscribe((buffer: GeoJsonObject) => {
        if (buffer) {
          const style = size === EBufferSize.SMALL ? GEOJSON_STYLES.smallBuffer : GEOJSON_STYLES.bigBuffer;
          this._bufferOnMap[size] = this._leafletMapService.addGeoJSONObject(buffer, style);
        }
      });
  }

  private _removeBuffer(size: EBufferSize): void {
    if (this._bufferOnMap[size]) {
      this._leafletMapService.removeLayer(this._bufferOnMap[size]);
    }
  }

  private _initLocationSearchInput(): void {
    this._searchInput = this._searchElementRef.nativeElement;

    this._googleMapsService.autocomplete(this._searchInput).then(
      autocomplete => {
        autocomplete.addListener('place_changed', () => {
          this._ngZone.run(() => {
            this.locationSearchResult = autocomplete.getPlace();
          });
        });
      },
      () => {
        /**/
      }
    );
  }
}
