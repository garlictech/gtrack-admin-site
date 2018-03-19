// Core
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, hikeEditPoiActions } from 'app/store';
import { IGTrackPoi } from 'app/shared/interfaces';
import { IDynamicComponentModalConfig, DynamicModalService } from 'subrepos/gtrack-common-ngx';

@Component({
  selector: 'hike-edit-pois-gtrack-table',
  templateUrl: './hike-edit-pois-gtrack-table.component.html'
})
export class HikeEditPoisGTrackTableComponent {
  @Input() pois$: IGTrackPoi[];
  @Input() onRouteCheck: boolean;

  constructor(
    private _store: Store<State>,
    private _dynamicModalService: DynamicModalService
  ) {}

  public handleInHikePoi($event, poi) {
    $event.stopPropagation();

    /*
    this._store.dispatch(new hikeEditPoiActions.SetGTrackPoiInHike({
      poiId: poi.id,
      isInHike: !poi.inHike
    }));*/
  }

  public openModal($event, poi: IGTrackPoi) {
    $event.stopPropagation();

    let _title = '';
    let _lng = 'en'; // TODO How we get the used lang??
    if (poi && poi.description && poi.description[_lng] && poi.description[_lng].title) {
      _title = poi.description[_lng].title;
    }

    const modalConfig: IDynamicComponentModalConfig = {
      component: {
        contentComponentName: 'HikeEditGTrackPoiInfoComponent',
        data: {
          poiId: <string>poi.id
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
