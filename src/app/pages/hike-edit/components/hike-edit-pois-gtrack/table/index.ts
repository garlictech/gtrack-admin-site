// Core
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, hikeEditPoiActions, editedHikeProgramActions } from 'app/store';
import { IGTrackPoi } from 'app/shared/interfaces';
import { LanguageService } from 'app/shared/services';
import { IDynamicComponentModalConfig, DynamicModalService } from 'subrepos/gtrack-common-ngx';

@Component({
  selector: 'hike-edit-pois-gtrack-table',
  templateUrl: './ui.html'
})
export class HikeEditPoisGTrackTableComponent {
  @Input() pois$: IGTrackPoi[];
  @Input() onRouteCheck: boolean;

  constructor(
    private _store: Store<State>,
    private _dynamicModalService: DynamicModalService
  ) {}

  public addPoi($event, poi) {
    $event.stopPropagation();

    this._store.dispatch(new editedHikeProgramActions.AddPoi(poi.id));

    this._store.dispatch(new hikeEditPoiActions.SetListDirty({
      subdomain: 'gTrack',
      dirty: true
    }));
  }

  public openModal($event, poi: IGTrackPoi) {
    $event.stopPropagation();

    const modalConfig: IDynamicComponentModalConfig = {
      component: {
        contentComponentName: 'HikeEditGTrackPoiInfoComponent',
        data: {
          poiId: <string>poi.id
        }
      },
      modal: {
        title: LanguageService.translateDescription(poi.description, 'title'),
        className: 'modal-lg',
        hasFooter: false
      }
    };
    this._dynamicModalService.showComponentModal(modalConfig);
  }

  public translateDescription(description, field) {
    return LanguageService.translateDescription(description, field);
  }
}
