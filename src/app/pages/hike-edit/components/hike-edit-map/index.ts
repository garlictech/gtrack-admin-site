import { Component, ViewChild, OnInit, OnDestroy, AfterViewInit, ElementRef, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { SelectItem } from 'primeng/api';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { State } from '../../../../store';
import { adminMapActions, commonBackgroundGeolocationActions } from '../../../../store/actions';
import { Center, selectCurrentLocation, IGeoPosition, GoogleMapsService } from 'subrepos/gtrack-common-ngx';
import { AdminLeafletComponent } from '../../../../shared/components/admin-leaflet';
import { LeafletMapComponent } from '@common.features/leaflet-map/components/leaflet-map';
import { WaypointMarkerService, EBufferSize, AdminMapService } from '../../../../shared/services/admin-map';
import * as hikeEditRoutePlannerSelectors from '../../../../store/selectors/hike-edit-route-planner';
import { ILeafletMapConfig } from '@common.features/leaflet-map/interfaces';

import * as L from 'leaflet';
import { GeoJsonObject } from 'geojson';

const CENTER = <Center>{
  lat: 47.689714,
  lng: 18.904206,
  zoom: 12
};

const LAYERS = [{
  name: 'street',
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
}, {
  name: 'topo',
  url: 'https://opentopomap.org/{z}/{x}/{y}.png'
}];

const OVERLAYS = [{
  name: 'trails',
  url: 'http://tile.lonvia.de/hiking/{z}/{x}/{y}.png'
}];

@Component({
  selector: 'app-hike-edit-map',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class HikeEditMapComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('adminmap') public mapComponent: AdminLeafletComponent;
  @ViewChild('newAdminMap') public newAdminMap: LeafletMapComponent;
  @ViewChild('search') private _searchElementRef: ElementRef;
  private _searchInput: HTMLInputElement;
  public center: Center = CENTER;
  public layers = LAYERS;
  public overlays = OVERLAYS;
  public mapConfig: ILeafletMapConfig;
  public mode = 'routing';
  public allowPlanning: boolean;
  public currentLocation$: Observable<IGeoPosition | null>;
  public clickModes: SelectItem[] = [];
  public locationSearchResult: google.maps.places.PlaceResult;
  public faSearch = faSearch;
  public EBufferSize = EBufferSize;
  private _bufferShown = {};
  private _bufferOnMap = {};
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _waypointMarkerService: WaypointMarkerService,
    private _adminMapService: AdminMapService,
    private _googleMapsService: GoogleMapsService,
    private _ngZone: NgZone
  ) {}

  ngOnInit() {
    this.clickModes = [{ label: 'Routing mode', value: 'routing' }, { label: 'Checkpoint mode', value: 'checkpoint' }];

    this.mapConfig = {
      fullScreenControl: true
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
    this._store.dispatch(new adminMapActions.ResetMap());
  }

  ngAfterViewInit() {
    // Disable wheel zoom
    this.mapComponent.leafletMap.scrollWheelZoom.disable(); // TODO remove line
    this.newAdminMap.leafletMap.scrollWheelZoom.disable();

    // TODO remove event listener block
    this.mapComponent.leafletMap
      // Add markers by click
      .on('click', (e: L.LeafletMouseEvent) => {
        if (this.allowPlanning) {
          if (this.mode === 'routing') {
            this._waypointMarkerService.addWaypoints([e.latlng]);
          } else {
            // this._createCheckpoint(e.latlng);
          }
        }
      });
  }

  public onMapClick(e: L.LeafletMouseEvent) {
    if (this.allowPlanning) {
      if (this.mode === 'routing') {
        this._waypointMarkerService.addWaypoints([e.latlng]);
      } else {
        // this._createCheckpoint(e.latlng);
      }
    }
  }

  public onMapMouseUp(e: L.LeafletMouseEvent) {
    // this.newAdminMap.leafletMap.scrollWheelZoom.enable();
  }

  public onMapMouseOut(e: L.LeafletMouseEvent) {
    // this.newAdminMap.leafletMap.scrollWheelZoom.disable();
  }

  public toggleCurrentPositionMarker($event: Event) {
    $event.stopPropagation();

    this.currentLocation$
      .pipe(take(1))
      .subscribe((position: IGeoPosition) => {
        if (position && position.coords) {
          const latLng = L.latLng(<number>position.coords.latitude, <number>position.coords.longitude);
          this.mapComponent.map.currentPositionMarker.goToPosition(latLng); // TODO remove line
          this.newAdminMap.currentPositionMarker.goToPosition(latLng);
        }
      });
  }

  public resetMap($event: Event) {
    $event.stopPropagation();

    this._store
      .pipe(
        select(hikeEditRoutePlannerSelectors.getRoute),
        take(1)
      )
      .subscribe((route: any) => {
        this.mapComponent.map.fitBounds(route); // TODO remove line

        const bounds: L.LatLngBoundsExpression = [[
          route.bounds.NorthEast.lat,
          route.bounds.NorthEast.lon
        ], [
          route.bounds.SouthWest.lat,
          route.bounds.SouthWest.lon
        ]];

        this.newAdminMap.fitBounds(bounds);
      });
  }

  public toggleBuffer($event: Event, size: EBufferSize) {
    $event.stopPropagation();

    this._bufferShown[size] = !this._bufferShown[size];

    if (this._bufferShown[size]) {
      this._addBuffer(size);
    } else {
      this._removeBuffer(size);
    }
  }

  private _addBuffer(size: EBufferSize) {
    this._adminMapService
      .getBuffer(size)
      .pipe(take(1))
      .subscribe((buffer: GeoJsonObject) => {
        if (buffer) {
          this._bufferOnMap[size] = this.mapComponent.map.addGeoJSON(buffer);

          // const geoJsonLayer = this._adminMapService.
        }
      });
  }

  private _removeBuffer(size: EBufferSize) {
    if (this._bufferOnMap[size]) {
      this.mapComponent.map.removeGeoJSON(this._bufferOnMap[size]);
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

  public goToLocation($event) {
    $event.stopPropagation();

    if (this.locationSearchResult) {
      this.mapComponent.map.leafletMap.setView(
        [this.locationSearchResult.geometry.location.lat(), this.locationSearchResult.geometry.location.lng()],
        13
      );
    }
  }
}
