import { Component, OnInit } from '@angular/core';
import { IDynamicComponentModalConfig } from 'subrepos/gtrack-common-ngx';
import { IWikipediaPoi, IGooglePoi, IOsmPoi } from 'app/shared/interfaces';

@Component({
  selector: 'gt-hike-edit-external-poi-info',
  templateUrl: './ui.html'
})
export class HikeEditExternalPoiInfoComponent implements OnInit {
  public static componentName = 'HikeEditExternalPoiInfoComponent';
  public poi: any;
  public modalConfig: IDynamicComponentModalConfig;

  ngOnInit() {
    if (this.modalConfig && this.modalConfig.component.data) {
      this.poi = this.modalConfig.component.data.poi;
    }
  }
}
