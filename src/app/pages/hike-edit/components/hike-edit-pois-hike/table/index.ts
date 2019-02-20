// Core
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { IGTrackPoi } from '../../../../../shared/interfaces';
import { State } from '../../../../../store';
import { editedHikeProgramActions } from '../../../../../store/actions';

@Component({
  selector: 'app-hike-edit-pois-hike-table',
  templateUrl: './ui.html'
})
export class HikeEditPoisHikeTableComponent {
  @Input() pois$: Array<IGTrackPoi>;
  @Input() onRouteCheck: boolean;
  @Input() openGTrackPoiModal: any;

  constructor(private readonly _store: Store<State>) {}

  removePoi($event, poi) {
    $event.stopPropagation();

    this._store.dispatch(new editedHikeProgramActions.RemoveStopByPoiId([poi.id]));
  }
}
