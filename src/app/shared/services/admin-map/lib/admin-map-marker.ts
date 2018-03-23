// import { MapMarker } from 'subrepos/gtrack-common-ngx/app/map/services/map-marker';
import { MapMarker, IconService } from 'subrepos/gtrack-common-ngx';
import * as uuid from 'uuid/v1';

export class AdminMapMarker extends MapMarker {
  public poiId: string;

  constructor(
    lat: number,
    lon: number,
    protected types: Array<string>,
    title: string,
    protected iconService: IconService,
    poiId: string
  ) {
    super(lat, lon, types, title, iconService);
    this.poiId = poiId;
  }
}
