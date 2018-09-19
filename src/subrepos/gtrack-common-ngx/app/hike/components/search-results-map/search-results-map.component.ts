import { Component, Input } from '@angular/core';
import { HikeListMapComponent } from '../hike-list-map';

import * as L from 'leaflet';

@Component({
  selector: 'gtrack-common-search-results-map',
  template: ''
})
export class SearchResultsMapComponent extends HikeListMapComponent {
  @Input()
  public circle: {
    lat: number;
    lng: number;
    radius: number;
  };

  protected _centerMap() {
    const map = this.map.map;

    const envelope = this._geometry.envelopeCircle([this.circle.lng, this.circle.lat], this.circle.radius);
    const southWest = new L.LatLng(envelope[0][0], envelope[0][1]);
    const northEast = new L.LatLng(envelope[1][0], envelope[1][1]);
    const box = new L.LatLngBounds(southWest, northEast);

    const circle = new L.Circle(
      {
        lat: this.circle.lat,
        lng: this.circle.lng
      },
      this.circle.radius
    );

    circle.addTo(map.leafletMap);

    map.fitBox(box);
  }
}
