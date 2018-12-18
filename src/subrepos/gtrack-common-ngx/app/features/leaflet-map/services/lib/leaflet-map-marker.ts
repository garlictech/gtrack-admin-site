import { LeafletIconService } from '../leaflet-icon.service';
import { ILeafletMarkerPopupData } from '../../interfaces';

import * as L from 'leaflet';

export class LeafletMapMarker {
  public marker: L.Marker;
  protected _highlighted = false;

  constructor(
    public lat: number,
    public lon: number,
    protected types: Array<string>,
    public title: string,
    protected leafletIconService: LeafletIconService,
    public additionalData: any,
    public popupData: ILeafletMarkerPopupData
  ) {
    this.marker = new L.Marker([lat, lon], {
      icon: this.leafletIconService.getLeafletIcon(types),
      title: title,
      zIndexOffset: 1500
    });

    this.marker.on('click', (e: L.LeafletMouseEvent) => {
      if (popupData) {
        popupData.markerClickCallback(this.marker, popupData, e);
      }
    });
  }

  public toggleHighlight() {
    this._highlighted = !this._highlighted;

    const iconType = this._highlighted ? 'highlight' : 'default';

    this.marker.setIcon(this.leafletIconService.getLeafletIcon(this.types, iconType));
  }

  public addToMap(map: L.Map): void {
    this.marker.addTo(map);

    // Custom event
    this.marker.on('click', (e: L.LeafletMouseEvent) => {
      map.fire('gcmarkerclick', e);
    });
  }

  public removeFromMap(map: L.Map): void {
    this.marker.removeFrom(map);
  }

  public get highlighted() {
    return this._highlighted;
  }

  public get coordinates(): L.LatLng {
    return this.marker.getLatLng();
  }
}
