// import { MapMarker } from 'subrepos/gtrack-common-ngx/app/map/services/map-marker';
import { MapMarker, IconService } from 'subrepos/gtrack-common-ngx';
import { IMarkerPopupData } from 'subrepos/provider-client/interfaces';

export class AdminMapMarker extends MapMarker {
  public poiId: string;

  constructor(
    lat: number,
    lon: number,
    protected types: Array<string>,
    title: string,
    protected iconService: IconService,
    poiId: string,
    popupData: IMarkerPopupData
  ) {
    super(lat, lon, types, title, iconService, popupData);
    this.poiId = poiId;
  }
}
