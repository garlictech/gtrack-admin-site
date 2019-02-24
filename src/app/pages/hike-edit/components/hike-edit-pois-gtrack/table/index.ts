// Core
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { GTrackPoi } from '../../../../../shared/interfaces';
import { State } from '../../../../../store';
import { editedHikeProgramActions } from '../../../../../store/actions';

@Component({
  selector: 'app-hike-edit-pois-gtrack-table',
  templateUrl: './ui.html'
})
export class HikeEditPoisGTrackTableComponent {
  @Input() pois$: Array<GTrackPoi>;
  @Input() onRouteCheck: boolean;
  @Input() openGTrackPoiModal: any;

  constructor(private readonly _store: Store<State>) {}

  addPoi($event, poi: GTrackPoi): void {
    $event.stopPropagation();

    this._store.dispatch(new editedHikeProgramActions.PrepareThenAddStop(poi));
  }
}
