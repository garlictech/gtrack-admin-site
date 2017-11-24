// Core
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { IExternalPoi } from '../../../../shared/interfaces/index';
import { State, HikeEditPoiActions } from '../../../../store';

@Component({
  selector: 'hike-edit-pois-external-table',
  templateUrl: './hike-edit-pois-external-table.component.html'
})
export class HikeEditPoisExternalTableComponent {
  @Input() pois: IExternalPoi[];
  @Input() subdomain: string;
  @Input() onRouteCheck: boolean;

  constructor(
    private _store: Store<State>,
    private _hikeEditPoiActions: HikeEditPoiActions
  ) {}

  public addPoi($event, idx) {
    $event.stopPropagation();

    this._store.dispatch(this._hikeEditPoiActions.setPoiInHike(this.subdomain, idx, true));
  }

  public removePoi($event, idx) {
    $event.stopPropagation();

    this._store.dispatch(this._hikeEditPoiActions.setPoiInHike(this.subdomain, idx, false));
  }
}
