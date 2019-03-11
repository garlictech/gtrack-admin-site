import * as L from 'leaflet';
// tslint:disable-next-line:no-import-side-effect
import 'leaflet-usermarker';

export class CurrentPositionMarker {
  private marker: L.UserMarker | null;

  constructor(protected map: L.Map) {}

  stopPositioning(): void {
    if (this.marker) {
      this.map.removeLayer(this.marker);
      this.marker = undefined;
    }
  }

  goToPosition(pos: L.LatLng): void {
    if (!this.marker) {
      this.marker = L.userMarker(pos, {
        pulsing: true,
        smallIcon: true
      }).addTo(this.map);
    }

    this.marker.setLatLng(pos);
    this.map.setView(pos, this.map.getZoom());
  }
}
