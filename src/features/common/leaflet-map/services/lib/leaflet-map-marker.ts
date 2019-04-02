import { LeafletMarkerPopupData } from '../../interfaces';
import { LeafletIconService } from '../leaflet-icon.service';

import { EIconStyle } from '@bit/garlictech.angular-features.common.marker-icons/enums';
import * as L from 'leaflet';

export class LeafletMapMarker {
  marker: L.Marker;
  protected _highlighted: boolean;

  constructor(
    public lat: number,
    public lon: number,
    protected types: Array<string>,
    public title: string,
    protected leafletIconService: LeafletIconService,
    public additionalData?: any,
    public popupData?: LeafletMarkerPopupData
  ) {
    this._highlighted = false;

    this.marker = new L.Marker([lat, lon], {
      icon: this.leafletIconService.getLeafletIcon(types),
      title,
      zIndexOffset: 1500
    });

    this.marker.on('click', (e: L.LeafletMouseEvent) => {
      if (e && e.originalEvent) {
        e.originalEvent.preventDefault();
      }

      if (popupData) {
        popupData.markerClickCallback(this.marker, popupData, e);
      }
    });
  }

  toggleHighlight(): void {
    this._highlighted = !this._highlighted;

    const iconStyle = this._highlighted ? EIconStyle.HIGHLIGHTED : EIconStyle.DEFAULT;

    this.marker.setIcon(this.leafletIconService.getLeafletIcon(this.types, iconStyle));
  }

  addHighlight(): void {
    this._highlighted = true;

    this.marker.setIcon(this.leafletIconService.getLeafletIcon(this.types, EIconStyle.HIGHLIGHTED));
  }

  removeHighlight(): void {
    this._highlighted = false;

    this.marker.setIcon(this.leafletIconService.getLeafletIcon(this.types, EIconStyle.DEFAULT));
  }

  addToMap(map: L.Map): void {
    this.marker.addTo(map);

    // Custom event
    this.marker.on('click', (e: L.LeafletMouseEvent) => {
      map.fire('gcmarkerclick', e);
    });
  }

  removeFromMap(map: L.Map): void {
    this.marker.removeFrom(map);
  }

  get highlighted(): boolean {
    return this._highlighted;
  }

  get coordinates(): L.LatLng {
    return this.marker.getLatLng();
  }
}
