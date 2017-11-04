
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Center } from '../../../../../subrepos/gtrack-common-ngx/app';
import { AdminLeafletComponent } from '../../../../shared/components/admin-leaflet';
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
  selector: 'gt-hike-map',
  templateUrl: './hike-map.component.html',
  styleUrls: ['./hike-map.component.scss']
})
export class HikeMapComponent implements AfterViewInit {
  @ViewChild('map')
  public mapComponent: AdminLeafletComponent;
  public center: Center = CENTER;
  public layers = LAYERS;
  public overlays = OVERLAYS;
  private _mode = 'routing';
  private _bufferShown = false;
  private _geoJsonOnMap: L.GeoJSON;

  ngAfterViewInit() {
    // Disable wheel zoom
    this.mapComponent.leafletMap.scrollWheelZoom.disable();

    this.mapComponent.leafletMap
      // Add markers by click
      .on('click', (e: LeafletMouseEvent) => {
        if (this._mode === 'routing') {
            this.mapComponent.map.waypointMarker.addWaypoint(e.latlng);

            // TODO Observable-val!
            console.log(this.mapComponent.map);
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

  public removeLast($event: Event) {
    $event.stopPropagation();
    this.mapComponent.map.waypointMarker.deleteLast();
  }

  public closeCircle($event: Event) {
    $event.stopPropagation();
    this.mapComponent.map.waypointMarker.closeCircle();
  }

  public deletePlan($event: Event) {
    $event.stopPropagation();
    this.mapComponent.map.routeInfo.deletePlan();
    this.mapComponent.map.waypointMarker.reset();
    this.mapComponent.map.routingControl.clearControls();
  }

  public buffer($event: Event) {
    $event.stopPropagation();
    this._bufferShown = !this._bufferShown;

    if (this._bufferShown) {
      this._geoJsonOnMap = this.mapComponent.map.addGeoJSON(this._getBuffer());
    } else {
      this.mapComponent.map.removeGeoJSON(this._geoJsonOnMap);
    }
  }

  public setMode($event: Event, mode: string) {
    $event.stopPropagation();
    console.log(this.mapComponent.map);
    this._mode = mode;
  }

  private _getBuffer() {
    let buffer: GeoJSON.Feature<GeoJSON.Polygon> = turf.buffer(this.mapComponent.map.routeInfo.getPath(), 50, 'meters');
    buffer.properties.name = 'buffer polygon';
    buffer.properties.draw_type = 'small_buffer';

    return buffer;
  }
}
