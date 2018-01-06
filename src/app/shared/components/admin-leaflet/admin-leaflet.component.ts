import { Component, Input, AfterViewInit } from '@angular/core';
import { AdminMap, AdminMapService } from 'app/shared/services/admin-map';
import { LeafletComponent } from 'subrepos/gtrack-common-ngx/app';

@Component({
  selector: 'gc-admin-leaflet',
  styleUrls: ['./admin-leaflet.component.scss'],
  template: '<div #map class="angular-leaflet-map"><ng-content></ng-content></div>'
})
export class AdminLeafletComponent extends LeafletComponent implements AfterViewInit {
  public map: AdminMap;

  constructor(private adminMapService: AdminMapService) {
    super(adminMapService);
  }
}
