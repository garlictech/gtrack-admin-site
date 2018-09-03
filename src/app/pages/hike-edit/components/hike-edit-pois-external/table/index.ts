// Core
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IExternalPoi } from '../../../../../shared/interfaces';
import { State, hikeEditPoiActions } from '../../../../../store';
import { EPoiTypes } from 'subrepos/provider-client';

import * as _ from 'lodash';

@Component({
  selector: 'hike-edit-pois-external-table',
  templateUrl: './ui.html'
})
export class HikeEditPoisExternalTableComponent {
  @Input() pois$: Observable<any[]>;
  @Input() subdomain: string;
  @Input() onRouteCheck: boolean;
  @Input() openPoiModal: any;

  constructor(
    private _store: Store<State>
  ) {}

  public handlePoiSelection(poiIds: string[]) {
    switch (this.subdomain) {
      case EPoiTypes.google:
        this._store.dispatch(new hikeEditPoiActions.SetGooglePoiSelected(poiIds));
        break;
      case EPoiTypes.wikipedia:
        this._store.dispatch(new hikeEditPoiActions.SetWikipediaPoiSelected(poiIds));
        break;
      case EPoiTypes.osmAmenity:
        this._store.dispatch(new hikeEditPoiActions.SetOsmAmenityPoiSelected(poiIds));
        break;
      case EPoiTypes.osmNatural:
        this._store.dispatch(new hikeEditPoiActions.SetOsmNaturalPoiSelected(poiIds));
        break;
      case EPoiTypes.osmRoute:
        this._store.dispatch(new hikeEditPoiActions.SetOsmRoutePoiSelected(poiIds));
        break;
    }
  }

  public invertSelection() {
    this.pois$
      .take(1)
      .subscribe(pois => {
        const clickablePois = pois.filter(p => {
          return !!p.onRoute === this.onRouteCheck && !p.inCollector && !p.inGtrackDb;
        });

        this.handlePoiSelection(_.map(clickablePois, 'id'));
      });
  }
}
