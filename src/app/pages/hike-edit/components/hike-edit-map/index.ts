
import { Component, ViewChild, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import { State, hikeEditMapActions, adminMapActions, commonBackgroundGeolocationActions } from 'app/store';
import { HikeEditRoutePlannerSelectors, HikeEditMapSelectors } from 'app/store/selectors';
import { Center, ISegment, BackgroundGeolocationActionTypes, selectCurrentLocation, IGeoPosition } from 'subrepos/gtrack-common-ngx';
import { AdminLeafletComponent } from 'app/shared/components/admin-leaflet';
import { AdminMapService, HikeProgramService } from 'app/shared/services';

import * as L from 'leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { WaypointMarkerService, RoutePlannerService } from 'app/shared/services/admin-map';

const CENTER = <Center>{
  // London
  // lat: 51.523723,
  // lng: -0.112525,
  // Pilis hg.
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
  selector: 'gt-hike-edit-map',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class HikeEditMapComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('map')
  public mapComponent: AdminLeafletComponent;
  public center: Center = CENTER;
  public layers = LAYERS;
  public overlays = OVERLAYS;
  public mode = 'routing';
  public allowPlanning: boolean;
  public currentLocation$: Observable<IGeoPosition | null>;
  private _bufferShown = false;
  private _bufferOnMap: L.GeoJSON;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _adminMapService: AdminMapService,
    private _hikeProgramService: HikeProgramService,
    private _waypointMarkerService: WaypointMarkerService,
    private _routePlannerService: RoutePlannerService,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _hikeEditMapSelectors: HikeEditMapSelectors
  ) {}

  ngOnInit() {
    // Update buffer on each segment update
    this._store
      .select(this._hikeEditRoutePlannerSelectors.getSegments)
      .takeUntil(this._destroy$)
      .subscribe(() => {
        // Refreh buffer on segment change, if needed
        setTimeout(() => {
          if (this._bufferShown) {
            this._removeBuffer();
            this._addBuffer();
          }
        });
      });

    this._store
      .select(this._hikeEditRoutePlannerSelectors.getIsPlanning)
      .takeUntil(this._destroy$)
      .subscribe((planning: boolean) => {
        this.allowPlanning = planning;
      });

    this._store.dispatch(new commonBackgroundGeolocationActions.StartTracking());

    this.currentLocation$ = this._store.select(selectCurrentLocation).takeUntil(this._destroy$);
  }

  ngOnDestroy( ) {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();

    this._store.dispatch(new commonBackgroundGeolocationActions.EndTracking());
    this._store.dispatch(new adminMapActions.ResetMap());
  }

  ngAfterViewInit() {
    // Disable wheel zoom
    this.mapComponent.leafletMap.scrollWheelZoom.disable();

    // Setup map events
    this.mapComponent.leafletMap
      // Add markers by click
      .on('click', (e: LeafletMouseEvent) => {
        if (this.allowPlanning) {
          if (this.mode === 'routing') {
            this._waypointMarkerService.addWaypoint(e.latlng);
          } else {
            // console.log('todo _createCheckpoint');
            // this._createCheckpoint(e.latlng);
          }
        }
      })

    /* WARNING: CAUSES BROWSER LAG!!
    // Turn on scrollWheelZoom after the first interaction (click/drag)
    .on('mouseup', () => {
      this.mapComponent.leafletMap.scrollWheelZoom.enable();
    })
    // Turn off scrollWheelZoom on mouse out
    .on('mouseout', () => {
      this.mapComponent.leafletMap.scrollWheelZoom.disable();
    });
    */
  }

  public toggleCurrentPositionMarker($event: Event) {
    $event.stopPropagation();

    this.currentLocation$.take(1).subscribe((position: IGeoPosition) => {
      if (position && position.coords) {
        const latLng = L.latLng(<number>position.coords.latitude, <number>position.coords.longitude)
        this.mapComponent.map.currentPositionMarker.goToPosition(latLng);
      }
    });
  }

  public resetMap($event: Event) {
    $event.stopPropagation();

    this._store
      .select(this._hikeEditRoutePlannerSelectors.getRoute)
      .take(1)
      .subscribe((route) => {
        this.mapComponent.map.fitBounds(route);
      });
  }

  public buffer($event: Event) {
    $event.stopPropagation();

    this._bufferShown = !this._bufferShown;

    if (this._bufferShown) {
      this._addBuffer();
    } else {
      this._removeBuffer();
    }
  }

  private _addBuffer() {
    this.mapComponent.map
      .getBuffer()
      .take(1)
      .subscribe((buffer) => {
        if (buffer) {
          this._bufferOnMap = this.mapComponent.map.addGeoJSON(buffer);
        }
      });
  }

  private _removeBuffer() {
    if (this._bufferOnMap) {
      this.mapComponent.map.removeGeoJSON(this._bufferOnMap);
    }
  }

  public setMode($event: Event, mode: string) {
    $event.stopPropagation();
    this.mode = mode;
  }
}
