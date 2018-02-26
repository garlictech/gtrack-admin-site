// Core
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, hikeEditPoiActions } from 'app/store';
import { IPoi } from 'subrepos/provider-client';

@Component({
  selector: 'hike-edit-pois-gtrack-table',
  templateUrl: './hike-edit-pois-gtrack-table.component.html'
})
export class HikeEditPoisGTrackTableComponent {
  @Input() pois$: IPoi[];
  @Input() onRouteCheck: boolean;

  constructor(
    private _store: Store<State>
  ) {}

}
