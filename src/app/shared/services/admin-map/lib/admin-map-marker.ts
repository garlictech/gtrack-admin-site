import { LeafletMapMarker } from '@common.features/leaflet-map/services/lib';
import { LeafletIconService } from '@common.features/leaflet-map/services/leaflet-icon.service';
import { ILeafletMarkerPopupData } from '@common.features/leaflet-map/interfaces';

export class AdminMapMarker extends LeafletMapMarker {
  public poiId: string;

  constructor(
    lat: number,
    lon: number,
    protected types: Array<string>,
    title: string,
    protected iconService: LeafletIconService,
    poiId: string,
    popupData: ILeafletMarkerPopupData
  ) {
    super(lat, lon, types, title, iconService, popupData);

    this.poiId = poiId;
  }
}
