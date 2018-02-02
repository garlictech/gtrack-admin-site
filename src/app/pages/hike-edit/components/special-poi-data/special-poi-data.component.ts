// Core
import { Component, Input } from '@angular/core';
import { GooglePoi, OsmPoi, WikipediaPoi } from 'app/shared/services/poi/lib';
import { DynamicModalService, IDynamicComponentModalConfig } from 'app/dynamic-modal';

@Component({
  selector: 'special-poi-data',
  templateUrl: 'special-poi-data.component.html'
})
export class SpecialPoiDataComponent {
  @Input() poi: GooglePoi | OsmPoi | WikipediaPoi;

  constructor(
    private _dynamicModalService: DynamicModalService
  ) {}

  public openModal(poi: GooglePoi | OsmPoi | WikipediaPoi) {
    const modalConfig: IDynamicComponentModalConfig = {
      component: {
        name: 'HikeEditPoiInfoModalContentComponent',
        data: {
          poi: poi
        }
      },
      modal: {
        title: poi.title,
        className: 'modal-lg'
      }
    };
    this._dynamicModalService.showComponentModal(modalConfig);
  }
}
