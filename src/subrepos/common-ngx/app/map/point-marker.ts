import * as L from 'leaflet';

import { Poi } from '../poi';
import { MapMarker, MapMarkerService } from '../map-marker';

export class PointMarker {
  public markers: MapMarker[] = [];
  public shownOnMap = false;

  constructor(protected map: L.Map, private mapMarkerService: MapMarkerService) {}

  public removeMarkers() {
    this.markers.forEach((marker) => marker.removeFromMap(this.map));
  }

  public addMarkers(pois: Poi[]) {
    pois.forEach((poi, i) => {
      let marker = this.mapMarkerService.create(poi.lat, poi.lon, poi.types, poi.title);
      marker.addToMap(this.map);
      this.markers.push(marker);
    });
  }
}
