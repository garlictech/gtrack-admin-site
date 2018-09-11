// Core
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../../../store';
import { editedHikeProgramActions } from '../../../../../store/actions';
import { IGTrackPoi } from '../../../../../shared/interfaces';

@Component({
  selector: 'app-hike-edit-pois-hike-table',
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
}
