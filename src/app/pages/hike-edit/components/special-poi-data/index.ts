// Core
import { Component, Input } from '@angular/core';
import { DynamicModalService, IDynamicComponentModalConfig } from 'subrepos/gtrack-common-ngx';
import { IGooglePoi, IOsmPoi, IWikipediaPoi } from 'app/shared/interfaces';

@Component({
  selector: 'gt-special-poi-data',
  templateUrl: 'ui.html'
})
export class SpecialPoiDataComponent {
  @Input() poi: IGooglePoi | IOsmPoi | IWikipediaPoi;

  constructor(
    private _dynamicModalService: DynamicModalService
  ) {}

  public openModal(poi: IGooglePoi | IOsmPoi | IWikipediaPoi) {
    let _title = '';
    let _lng = 'en'; // TODO How we get the used lang??
    if (poi && poi.description && poi.description[_lng] && poi.description[_lng].title) {
      _title = poi.description[_lng].title;
    }

    const modalConfig: IDynamicComponentModalConfig = {
      component: {
        contentComponentName: 'HikeEditExternalPoiInfoComponent',
        data: {
          poi: poi
        }
      },
      modal: {
        title: _title,
        className: 'modal-lg',
        hasFooter: false
      }
    };
    this._dynamicModalService.showComponentModal(modalConfig);
  }
}
