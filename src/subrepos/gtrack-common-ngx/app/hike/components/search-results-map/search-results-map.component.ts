import { Component, Input } from '@angular/core';
import * as L from 'leaflet';
import { HikeListMapComponent } from '../hike-list-map';

@Component({
  selector: 'gtrack-common-search-results-map',
  template: ''
})
export class SearchResultsMapComponent extends HikeListMapComponent {
  @Input() circle: {
    lat: number;
    lng: number;
    radius: number;
  };

  protected _centerMap(): void {
    const map = this.map.leafletMap;

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

    circle.addTo(map);

    this._leafletMapService.fitBounds(box);
  }
}
