import * as L from 'leaflet';

import { MapMarker, MapMarkerService } from '../map-marker';
import { IPoi } from 'subrepos/provider-client';

export class PointMarker {
  public markers: MapMarker[] = [];
  public shownOnMap = false;

  constructor(protected map: L.Map, private mapMarkerService: MapMarkerService) {}

  public addMarkersToMap() {
    this.markers.forEach(marker => {
      marker.addToMap(this.map);
    });

    this.shownOnMap = true;
  }

  public removeMarkersFromMap() {
    this.markers.forEach(marker => marker.removeFromMap(this.map));
    this.shownOnMap = false;
  }

  public removeMarkers() {
    this.markers = [];
  }

  public addMarkers(pois: IPoi[]) {
    pois.forEach((poi, i) => {
      // TODO: poi.title is deprecated. Use poi.description[lng].title
      let marker = this.mapMarkerService.create(poi.lat, poi.lon, poi.types, poi.description.en_US.title);
      this.markers.push(marker);

      if (this.shownOnMap === true) {
        marker.addToMap(this.map);
      }
    });
  }
}
