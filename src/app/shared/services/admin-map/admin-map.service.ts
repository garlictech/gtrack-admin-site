import { Injectable } from '@angular/core';
import { AdminMap } from './admin-map';
import { IconService, MapMarkerService, MapService } from '../../../../subrepos/gtrack-common-ngx/app';

@Injectable()
export class AdminMapService extends MapService {
  constructor(protected iconService: IconService, protected mapMarkerService: MapMarkerService) {
    super(iconService, mapMarkerService);
  }

  get(map: L.Map): AdminMap {
    return new AdminMap(map, this.iconService, this.mapMarkerService);
  }
}
