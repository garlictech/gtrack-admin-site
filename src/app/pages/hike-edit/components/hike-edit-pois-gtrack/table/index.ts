// Core
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../../../store';
import { editedHikeProgramActions } from '../../../../../store/actions';
import { IGTrackPoi } from '../../../../../shared/interfaces';

@Component({
  selector: 'app-hike-edit-pois-gtrack-table',
  templateUrl: './ui.html'
})
export class HikeEditPoisGTrackTableComponent {
  @Input()
  pois$: IGTrackPoi[];
  @Input()
  onRouteCheck: boolean;
  @Input()
  openGTrackPoiModal: any;

  constructor(private _store: Store<State>) {}

  public addPoi($event, poi: IGTrackPoi) {
    $event.stopPropagation();

    this._store.dispatch(new editedHikeProgramActions.PrepareThenAddStop(poi));
  }
}
