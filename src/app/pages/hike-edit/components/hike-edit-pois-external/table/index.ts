import _map from 'lodash-es/map';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

// Core
import { Component, Input } from '@angular/core';
import { EPoiTypes } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { Store } from '@ngrx/store';

import { State } from '../../../../../store';
import { hikeEditPoiActions } from '../../../../../store/actions';

@Component({
  selector: 'app-hike-edit-pois-external-table',
  templateUrl: './ui.html'
})
export class HikeEditPoisExternalTableComponent {
  @Input() pois$: Observable<Array<any>>;
  @Input() subdomain: string;
  @Input() onRouteCheck: boolean;
  @Input() openPoiModal: any;

  constructor(private readonly _store: Store<State>) {}

  handlePoiSelection(poiIds: Array<string>): void {
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
      default:
        break;
    }
  }

  invertSelection(): void {
    this.pois$.pipe(take(1)).subscribe(pois => {
      const clickablePois = pois.filter(p => !!p.onRoute === this.onRouteCheck && !p.inCollector && !p.inGtrackDb);

      this.handlePoiSelection(_map(clickablePois, 'id'));
    });
  }
}
