// Core
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, hikeEditPoiActions } from 'app/store';
import { IGTrackPoi } from 'app/shared/interfaces';

@Component({
  selector: 'hike-edit-pois-gtrack-table',
  templateUrl: './hike-edit-pois-gtrack-table.component.html'
})
export class HikeEditPoisGTrackTableComponent {
  @Input() pois$: IGTrackPoi[];
  @Input() onRouteCheck: boolean;

  constructor(
    private _store: Store<State>
  ) {}

  public handleInHikePoi($event, poi) {
    $event.stopPropagation();

    this._store.dispatch(new hikeEditPoiActions.SetGTrackPoiInHike({
      poiId: poi.id,
      isInHike: !poi.inHike
    }));
  }
}
