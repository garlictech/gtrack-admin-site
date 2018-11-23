import { Component } from '@angular/core';
import { AdminMap, AdminMapService } from '../../services/admin-map';
import { LeafletComponent } from 'subrepos/gtrack-common-ngx/app';

@Component({
  selector: 'app-admin-leaflet',
  template: '<div #map class="angular-leaflet-map" style="height: 300px; width: 100%"><ng-content></ng-content></div>'
})
export class AdminLeafletComponent extends LeafletComponent {
  public map: AdminMap;

  constructor(_adminMapService: AdminMapService) {
    super(_adminMapService);
  }
}
