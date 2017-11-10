
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Center } from '../../../../../subrepos/gtrack-common-ngx/app';
import { AdminLeafletComponent } from '../../../../shared/components/admin-leaflet';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { State, HikeEditMapActions } from '../../../../store';
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
  private _mode$: Observable<string>;
  public mode: string;

  constructor(
    private _store: Store<State>,
    private _actions: HikeEditMapActions
  ) {
    this._mode$ = this._store.select((state: State) => state.hikeEditMap.mode);
    this._mode$.subscribe((mode: string) => {
      this.mode = mode;
    });
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
    this._store.dispatch(this._actions.toggleCurrentPositionMarker());
  }

  public resetMap($event: Event) {
    $event.stopPropagation();
    this._store.dispatch(this._actions.resetMap());
  }

  public buffer($event: Event) {
    $event.stopPropagation();
    this._store.dispatch(this._actions.toggleBuffer());

    /*
    this._bufferShown = !this._bufferShown;

    if (this._bufferShown) {
      this._geoJsonOnMap = this.mapComponent.map.addGeoJSON(this._getBuffer());
      console.log('this._geoJsonOnMap ', this._geoJsonOnMap );
    } else {
      this.mapComponent.map.removeGeoJSON(this._geoJsonOnMap);
    }
    */
  }

  public setMode($event: Event, mode: string) {
    $event.stopPropagation();
    this._store.dispatch(this._actions.setMode(mode));
  }

  private _getBuffer() {
    let buffer: GeoJSON.Feature<GeoJSON.Polygon> = turf.buffer(this.mapComponent.map.routeInfo.getPath(), 50, 'meters');
    buffer.properties.name = 'buffer polygon';
    buffer.properties.draw_type = 'small_buffer';

    return buffer;
  }
}
