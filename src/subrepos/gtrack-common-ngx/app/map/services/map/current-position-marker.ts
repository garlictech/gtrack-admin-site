import { take } from 'rxjs/operators';
import * as L from 'leaflet';
import 'leaflet-usermarker';
import { Store, select } from '@ngrx/store';

import { selectCurrentLocation } from '../../../store';

export class CurrentPositionMarker {
  protected marker: L.UserMarker | null = null;
  public positioningInverval = 10000;
  public timeout = 10000;

  constructor(protected map: L.Map, protected _store: Store<any>) {}

  public stopPositioning() {
    if (this.marker) {
      this.map.removeLayer(this.marker);
      this.marker = null;
    }
  }

  public goToCurrentPosition() {
    // this.map.spin(true);

    this._store
      .pipe(
        select(selectCurrentLocation),
        take(1)
      )
      .subscribe(geoPosition => {
        if (!this.marker) {
          this.marker = L.userMarker([geoPosition.coords.latitude, geoPosition.coords.longitude], {
            pulsing: true,
            smallIcon: true
          }).addTo(this.map);
        }

        this.marker.setLatLng([geoPosition.coords.latitude, geoPosition.coords.longitude]);
        this.marker.setAccuracy(geoPosition.coords.accuracy);
        this.map.setView([geoPosition.coords.latitude, geoPosition.coords.longitude], this.map.getZoom());
        // this.map.spin(false);
      });
  }

  public goToPosition(pos: L.LatLng) {
    if (!this.marker) {
      this.marker = L.userMarker(pos, {
        pulsing: true,
        smallIcon: true
      }).addTo(this.map);
    }

    this.marker.setLatLng(pos);
    this.map.setView(pos, this.map.getZoom());
    // this.map.spin(false);
  }
}
