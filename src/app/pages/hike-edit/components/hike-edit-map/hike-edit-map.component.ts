
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Center } from '../../../../../subrepos/gtrack-common-ngx/app';
import { AdminLeafletComponent } from '../../../../shared/components/admin-leaflet';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { State, HikeEditMapActions, IHikeEditMapState } from '../../../../store';
import { LeafletMouseEvent } from 'leaflet';
import * as turf from '@turf/turf';

const CENTER = <Center>{
  lat: 51.505,
  lng: -0.09,
  zoom: 14
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
export class HikeEditMapComponent implements AfterViewInit {
  @ViewChild('map')
  public mapComponent: AdminLeafletComponent;
  public center: Center = CENTER;
  public layers = LAYERS;
  public overlays = OVERLAYS;
  public mode = 'routing';
  private _bufferShown = false;

  constructor(
    private _store: Store<State>,
    private _actions: HikeEditMapActions
  ) {}

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
    this.mapComponent.map.fitBounds(this.mapComponent.map.routeInfo.getTrack());
  }

  public buffer($event: Event) {
    $event.stopPropagation();

    this._bufferShown = !this._bufferShown;
    if (this._bufferShown) {
      this._store.dispatch(this._actions.addGeoJson());
    } else {
      this._store.dispatch(this._actions.removeGeoJson());
    }
  }

  public setMode($event: Event, mode: string) {
    $event.stopPropagation();
    this.mode = mode;
  }
}
