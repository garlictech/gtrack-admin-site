import { IconService } from '../icon';
import { IMarkerPopupData } from '../../../../../provider-client/interfaces';

import * as L from 'leaflet';

export class MapMarker {
  public marker: L.Marker;
  protected _highlighted = false;

  constructor(
    lat: number,
    lon: number,
    protected types: Array<string>,
    title: string,
    protected iconService: IconService,
    popupData: IMarkerPopupData
  ) {
    this.marker = new L.Marker([lat, lon], {
      icon: iconService.getLeafletIcon(types),
      title: title
    });

    this.marker.on('click', e => {
      if (popupData) {
        popupData.markerClickCallback(this.marker, popupData, e);
      }
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
