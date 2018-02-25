
import { Component, ViewChild, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import { State } from 'app/store';
import { LeafletMouseEvent } from 'leaflet';
import { Center, ISegment } from 'subrepos/gtrack-common-ngx';
import { AdminLeafletComponent } from 'app/shared/components/admin-leaflet';
import * as L from 'leaflet';

const CENTER = <Center>{
  lat: 47.689714,
  lng: 18.904206,
  zoom: 13
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
  templateUrl: './hike-edit-map.component.html',
  styleUrls: ['./hike-edit-map.component.scss']
})
export class HikeEditMapComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('map')
  public mapComponent: AdminLeafletComponent;
  public center: Center = CENTER;
  public layers = LAYERS;
  public overlays = OVERLAYS;
  public mode = 'routing';
  private _bufferShown = false;
  private _geoJsonOnMap: L.GeoJSON;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>
  ) {}

  ngOnInit() {
    // Update buffer on each segment update
    this._store.select((state: State) => state.hikeEditRoutePlanner.segments)
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
  }

  ngOnDestroy( ) {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  ngAfterViewInit() {
    // Disable wheel zoom
    this.mapComponent.leafletMap.scrollWheelZoom.disable();

    // Setup map events
    this.mapComponent.leafletMap
      // Add markers by click
      .on('click', (e: LeafletMouseEvent) => {
        if (this.mode === 'routing') {
          // TODO action
          this.mapComponent.map.waypointMarker.addWaypoint(e.latlng);
        } else {
          console.log('todo _createCheckpoint');
          // this._createCheckpoint(e.latlng);
        }
      })

      // Turn on scrollWheelZoom after the first interaction (click/drag)
      .on('mouseup', () => {
        this.mapComponent.leafletMap.scrollWheelZoom.enable();
      })
      // Turn off scrollWheelZoom on mouse out
      .on('mouseout', () => {
        this.mapComponent.leafletMap.scrollWheelZoom.disable();
      });
  }

  public toggleCurrentPositionMarker($event: Event) {
    $event.stopPropagation();
    this.mapComponent.map.currentPositionMarker.goToCurrentPosition();
  }

  public resetMap($event: Event) {
    $event.stopPropagation();
    this.mapComponent.map.fitBounds(this.mapComponent.map.routeInfo.getRoute());
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
    const _buffer = this.mapComponent.map.getBuffer();
    if (_buffer) {
      this._geoJsonOnMap = this.mapComponent.map.addGeoJSON(_buffer);
    }
  }

  private _removeBuffer() {
    if (this._geoJsonOnMap) {
      this.mapComponent.map.removeGeoJSON(this._geoJsonOnMap);
    }
  }

  public setMode($event: Event, mode: string) {
    $event.stopPropagation();
    this.mode = mode;
  }
}
