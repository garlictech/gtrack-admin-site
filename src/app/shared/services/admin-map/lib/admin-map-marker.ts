// import { MapMarker } from 'subrepos/gtrack-common-ngx/app/map/services/map-marker';
import { MapMarker, IconService } from 'subrepos/gtrack-common-ngx';
import * as uuid from 'uuid/v1';

export class AdminMapMarker extends MapMarker {
  public id: string;
  public subdomain: string;
  public poiId: string;

  constructor(
    lat: number,
    lon: number,
    protected types: Array<string>,
    title: string,
    protected iconService: IconService,
    subdomain: string,
    poiId: string
  ) {
    super(lat, lon, types, title, iconService);

    (<any>this.marker).options.subdomain = subdomain;
    this.id = uuid();
    this.poiId = poiId;
  }
}
