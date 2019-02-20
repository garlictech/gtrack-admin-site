import { GeoJsonObject } from 'geojson';
import * as L from 'leaflet';
import { SelectItem } from 'primeng/api';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { GoogleMapsService, IGeoPosition, selectCurrentLocation } from 'subrepos/gtrack-common-ngx';

import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LeafletMapComponent } from '@common.features/leaflet-map/components/leaflet-map';
import { GEOJSON_STYLES } from '@common.features/leaflet-map/constants/geojson-styles';
import { ICenter, ILayerDef, ILeafletMapConfig } from '@common.features/leaflet-map/interfaces';
import { LeafletMapService } from '@common.features/leaflet-map/services/leaflet-map.service';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { select, Store } from '@ngrx/store';

import { AdminMapService, EBufferSize, WaypointMarkerService } from '../../../../shared/services/admin-map';
import { State } from '../../../../store';
import { commonBackgroundGeolocationActions } from '../../../../store/actions';
import * as hikeEditRoutePlannerSelectors from '../../../../store/selectors/hike-edit-route-planner';

const CENTER = {
  lat: 47.689714,
  lng: 18.904206,
  zoom: 12
} as ICenter;

const LAYERS: Array<ILayerDef> = [
  {
    name: 'street',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  },
  {
    name: 'topo',
    url: 'https://opentopomap.org/{z}/{x}/{y}.png'
  }
];

const OVERLAYS: Array<ILayerDef> = [
  {
    name: 'trails',
    url: 'http://tile.lonvia.de/hiking/{z}/{x}/{y}.png'
  }
];

@Component({
  selector: 'app-hike-edit-map',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class HikeEditMapComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('adminMap') adminMap: LeafletMapComponent;
  center: ICenter = CENTER;
  layers: Array<ILayerDef> = LAYERS;
  overlays: Array<ILayerDef> = OVERLAYS;
  mapConfig: ILeafletMapConfig;
  mode = 'routing';
  allowPlanning: boolean;
  currentLocation$: Observable<IGeoPosition | null>;
  clickModes: Array<SelectItem> = [];
  locationSearchResult: google.maps.places.PlaceResult;
  faSearch = faSearch;
  EBufferSize = EBufferSize;
  @ViewChild('search') private readonly _searchElementRef: ElementRef;
  private _searchInput: HTMLInputElement;
  private readonly _bufferShown = {};
  private readonly _bufferOnMap = {};
  private readonly _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private readonly _store: Store<State>,
    private readonly _waypointMarkerService: WaypointMarkerService,
    private readonly _adminMapService: AdminMapService,
    private readonly _googleMapsService: GoogleMapsService,
    private readonly _ngZone: NgZone,
    private readonly _leafletMapService: LeafletMapService
  ) {}

  ngOnInit() {
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

    this._store.dispatch(new commonBackgroundGeolocationActions.StartTracking());

    this.currentLocation$ = this._store.pipe(
      select(selectCurrentLocation),
      takeUntil(this._destroy$)
    );

    this._initLocationSearchInput();
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.complete();

    this._store.dispatch(new commonBackgroundGeolocationActions.EndTracking());
  }

  ngAfterViewInit() {
    // Disable wheel zoom
    this.adminMap.leafletMap.scrollWheelZoom.disable();
  }

  onMapClick(e: L.LeafletMouseEvent) {
    if (this.allowPlanning) {
      if (this.mode === 'routing') {
        this._waypointMarkerService.addWaypoints([e.latlng]);
      } else {
        // this._createCheckpoint(e.latlng);
      }
    }
  }

  onMapMouseUp(e: L.LeafletMouseEvent) {
    // this.adminMap.leafletMap.scrollWheelZoom.enable();
  }

  onMapMouseOut(e: L.LeafletMouseEvent) {
    // this.adminMap.leafletMap.scrollWheelZoom.disable();
  }

  toggleCurrentPositionMarker($event: Event) {
    $event.stopPropagation();

    this.currentLocation$.pipe(take(1)).subscribe((position: IGeoPosition) => {
      if (position && position.coords) {
        const latLng = L.latLng(position.coords.latitude as number, position.coords.longitude as number);
        this.adminMap.currentPositionMarker.goToPosition(latLng);
      }
    });
  }

  resetMap($event: Event) {
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

  toggleBuffer($event: Event, size: EBufferSize) {
    $event.stopPropagation();

    this._bufferShown[size] = !this._bufferShown[size];

    if (this._bufferShown[size]) {
      this._addBuffer(size);
    } else {
      this._removeBuffer(size);
    }
  }

  goToLocation($event) {
    $event.stopPropagation();

    if (this.locationSearchResult) {
      this._leafletMapService.leafletMap.setView(
        [this.locationSearchResult.geometry.location.lat(), this.locationSearchResult.geometry.location.lng()],
        13
      );
    }
  }

  private _addBuffer(size: EBufferSize) {
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

  private _removeBuffer(size: EBufferSize) {
    if (this._bufferOnMap[size]) {
      this._leafletMapService.removeLayer(this._bufferOnMap[size]);
    }
  }

  private _initLocationSearchInput() {
    this._searchInput = this._searchElementRef.nativeElement;

    this._googleMapsService.autocomplete(this._searchInput).then(autocomplete => {
      autocomplete.addListener('place_changed', () => {
        this._ngZone.run(() => {
          this.locationSearchResult = autocomplete.getPlace();
        });
      });
    });
  }
}
