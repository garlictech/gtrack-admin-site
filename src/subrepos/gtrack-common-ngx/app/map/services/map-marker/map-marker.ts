import { IconService } from '../icon';
import * as L from 'leaflet';

export class MapMarker {
  public marker: L.Marker;
  protected _highlighted = false;

  constructor(
    lat: number,
    lon: number,
    private types: Array<string>,
    title: string,
    private iconService: IconService
  ) {
    this.marker = new L.Marker([lat, lon], {
      icon: iconService.getLeafletIcon(types),
      title: title
    });
  }

  public toggleHighlight() {
    let iconType = 'default';

    this._highlighted = !this._highlighted;

    if (this._highlighted === true) {
      iconType = 'highlight';
    }

    this.marker.setIcon(this.iconService.getLeafletIcon(this.types, iconType));
  }

  public addToMap(map: L.Map): void {
    this.marker.addTo(map);
  }

  public removeFromMap(map: L.Map): void {
    this.marker.removeFrom(map);
  }

  public get highlighted() {
    return this._highlighted;
  }

  public get coordinates(): L.LatLng {
    let latlng = this.marker.getLatLng();

    return latlng;
  }
}
