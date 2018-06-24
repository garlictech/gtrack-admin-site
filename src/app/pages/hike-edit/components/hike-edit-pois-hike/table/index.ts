// Core
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, hikeEditPoiActions, editedHikeProgramActions } from 'app/store';
import { IGTrackPoi } from 'app/shared/interfaces';
import { LanguageService } from 'app/shared/services';

@Component({
  selector: 'hike-edit-pois-hike-table',
  templateUrl: './ui.html'
})
export class HikeEditPoisHikeTableComponent {
  @Input() pois$: IGTrackPoi[];
  @Input() onRouteCheck: boolean;
  @Input() openGTrackPoiModal: any;

  constructor(
    private _store: Store<State>
  ) {}

  public removePoi($event, poi) {
    $event.stopPropagation();

    this._store.dispatch(new editedHikeProgramActions.RemoveStopByPoiId([poi.id]));
  }

  public translateDescription(description, field) {
    return LanguageService.translateDescription(description, field);
  }
}
