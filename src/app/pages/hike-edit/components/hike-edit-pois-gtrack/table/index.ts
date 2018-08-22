// Core
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, editedHikeProgramActions } from '../../../../../store';
import { Subject } from 'rxjs';
import { IGTrackPoi } from '../../../../../shared/interfaces';

@Component({
  selector: 'hike-edit-pois-gtrack-table',
  templateUrl: './ui.html'
})
export class HikeEditPoisGTrackTableComponent {
  @Input() pois$: IGTrackPoi[];
  @Input() onRouteCheck: boolean;
  @Input() openGTrackPoiModal: any;

  constructor(
    private _store: Store<State>
  ) {}

  public addPoi($event, poi: IGTrackPoi) {
    $event.stopPropagation();

    this._store.dispatch(new editedHikeProgramActions.PrepareThenAddStop(poi));
  }
}
