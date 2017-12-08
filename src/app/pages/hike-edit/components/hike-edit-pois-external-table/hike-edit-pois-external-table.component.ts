// Core
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { IExternalPoi } from 'app/shared/interfaces/index';
import { State, hikeEditPoiActions } from 'app/store';

@Component({
  selector: 'hike-edit-pois-external-table',
  templateUrl: './hike-edit-pois-external-table.component.html'
})
export class HikeEditPoisExternalTableComponent {
  @Input() pois: IExternalPoi[];
  @Input() subdomain: string;
  @Input() onRouteCheck: boolean;

  constructor(
    private _store: Store<State>
  ) {}

  public addPoi($event, idx) {
    $event.stopPropagation();

    this._store.dispatch(new hikeEditPoiActions.SetPoiInHike({
      subdomain: this.subdomain,
      poiIdx: idx,
      isInHike: true
    }));
  }

  public removePoi($event, idx) {
    $event.stopPropagation();

    this._store.dispatch(new hikeEditPoiActions.SetPoiInHike({
      subdomain: this.subdomain,
      poiIdx: idx,
      isInHike: false
    }));
  }
}
