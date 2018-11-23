import * as L from 'leaflet';
import 'leaflet-usermarker';
import 'leaflet-spin';

export class CurrentPositionMarker {
  private marker: L.UserMarker | null = null;

  constructor(
    protected map: L.Map
  ) {}

  public stopPositioning() {
    if (this.marker) {
      this.map.removeLayer(this.marker);
      this.marker = null;
    }
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
    this.map.spin(false);
  }
}
