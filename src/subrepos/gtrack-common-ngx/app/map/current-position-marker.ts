import 'leaflet-usermarker';
import 'leaflet-spin';

import * as L from 'leaflet';

export class CurrentPositionMarker {
  protected marker: L.UserMarker = null;
  public positioningInverval = 10000;
  public timeout = 10000;

  constructor(protected map: L.Map) {};

  public stopPositioning() {
    if (this.marker) {
      this.map.removeLayer(this.marker);
      this.marker = null;
    }

    this.map.stopLocate();
    this.map.off('locationfound');
  }

  public goToCurrentPosition() {
    let locationFound = (e: L.LocationEvent) => {
      this.map.off('locationfound', locationFound);
      if (!this.marker) {
        this.marker = L
          .userMarker(e.latlng, {
            pulsing: true,
            smallIcon: true
          })
          .addTo(this.map);
      }

      this.marker.setLatLng(e.latlng);
      this.marker.setAccuracy(e.accuracy);
      this.map.setView(e.latlng, this.map.getZoom());
      this.map.spin(false);
    };

    this.map.spin(true);
    this.map.on('locationfound', locationFound);

    this.map.locate({
      watch: true,
      setView: false,
      enableHighAccuracy: true,
      timeout: this.timeout,
      maximumAge: this.positioningInverval
    });
  }
}
