import { Component, Input, AfterViewInit } from '@angular/core';
import { AdminMap, AdminMapService } from '../../services/admin-map';
import { LeafletComponent } from '../../../../subrepos/gtrack-common-ngx/app';

@Component({
  selector: 'gc-admin-leaflet',
  template: '<div #map class="angular-leaflet-map"><ng-content></ng-content></div>'
})
export class AdminLeafletComponent extends LeafletComponent implements AfterViewInit {
  @Input()
  public id = 'admin-map';
  public map: AdminMap;

  constructor(private adminMapService: AdminMapService) {
    super(adminMapService);
  }
}
