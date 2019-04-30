import * as L from 'leaflet';

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HikeListMapComponent } from '@bit/garlictech.angular-features.common.hike';

@Component({
  selector: 'gtrack-common-search-results-map',
  template: ''
})
export class SearchResultsMapComponent extends HikeListMapComponent implements OnChanges {
  @Input() circle: {
    lat: number;
    lng: number;
    radius: number;
  };

  private _leafletCircle: L.Circle;

  centerMap(): void {
    const map = this.map.leafletMap;

    const envelope = this._geometry.envelopeCircle([this.circle.lng, this.circle.lat], this.circle.radius);
    const southWest = new L.LatLng(envelope[0][0], envelope[0][1]);
    const northEast = new L.LatLng(envelope[1][0], envelope[1][1]);
    const box = new L.LatLngBounds(southWest, northEast);

    if (this._leafletCircle) {
      this._leafletCircle.remove();
    }

    this._leafletCircle = new L.Circle(
      {
        lat: this.circle.lat,
        lng: this.circle.lng
      },
      this.circle.radius,
      {
        fill: false
      }
    );

    this._leafletCircle.addTo(map);

    this._leafletMapService.fitBounds(box);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.circle && !changes.circle.isFirstChange()) {
      this.centerMap();
    }

    super.ngOnChanges(changes);
  }
}
