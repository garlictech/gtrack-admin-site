import {
  Map,
  IconService,
  MapMarkerService
} from '../../../../subrepos/gtrack-common-ngx/app';

export class AdminMap extends Map {
  constructor(
    protected map: L.Map,
    protected iconService: IconService,
    protected mapMarkerService: MapMarkerService
  ) {
    super(map, iconService, mapMarkerService);

    console.log('ADMIN MAP CREATED');
  }
}
