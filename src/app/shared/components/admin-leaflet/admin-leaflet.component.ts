import { Component } from '@angular/core';
import { AdminMap, AdminMapService } from '../../services/admin-map';
import { LeafletComponent } from 'subrepos/gtrack-common-ngx/app';

@Component({
  selector: 'app-admin-leaflet',
  styleUrls: ['./admin-leaflet.component.scss'],
  template: '<div #map class="angular-leaflet-map"><ng-content></ng-content></div>'
})
export class AdminLeafletComponent extends LeafletComponent {
  public map: AdminMap;

  constructor(
    private _adminMapService: AdminMapService
  ) {
    super(_adminMapService);
  }
}
