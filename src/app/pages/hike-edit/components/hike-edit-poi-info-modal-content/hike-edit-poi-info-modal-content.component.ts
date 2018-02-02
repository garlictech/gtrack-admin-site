
import { Component, OnInit } from '@angular/core';
import { GooglePoi, OsmPoi, WikipediaPoi } from 'app/shared/services/poi/lib';
import { IDynamicComponentModalConfig } from 'app/dynamic-modal';

@Component({
  selector: 'gt-hike-edit-poi-info-modal-content',
  templateUrl: './hike-edit-poi-info-modal-content.component.html'
})
export class HikeEditPoiInfoModalContentComponent implements OnInit {
  public poi: GooglePoi | OsmPoi | WikipediaPoi;
  public modalConfig: IDynamicComponentModalConfig

  ngOnInit() {
    if (this.modalConfig && this.modalConfig.component.data) {
      this.poi = this.modalConfig.component.data.poi;
    }
 }
}
