// Core
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { IExternalPoi } from '../../../../../shared/interfaces';
import { State, hikeEditPoiActions } from '../../../../../store';
import { EPoiTypes } from 'subrepos/provider-client';
import { subscribeOn } from 'rxjs-compat/operator/subscribeOn';

@Component({
  selector: 'hike-edit-pois-external-table',
  templateUrl: './ui.html'
})
export class HikeEditPoisExternalTableComponent {
  @Input() pois$: Observable<IWikipediaPoi[] | IGooglePoi[] | IOsmPoi[]>;
  @Input() subdomain: string;
  @Input() onRouteCheck: boolean;
  @Input() openPoiModal: any;

  constructor(
    private _store: Store<State>
  ) {}

  public handlePoiSelection(poi) {
    switch (this.subdomain) {
      case EPoiTypes.google:
        this._store.dispatch(new hikeEditPoiActions.SetGooglePoiSelected(poi.id));
        break;
      case EPoiTypes.wikipedia:
        this._store.dispatch(new hikeEditPoiActions.SetWikipediaPoiSelected(poi.id));
        break;
      case EPoiTypes.osmAmenity:
        this._store.dispatch(new hikeEditPoiActions.SetOsmAmenityPoiSelected(poi.id));
        break;
      case EPoiTypes.osmNatural:
        this._store.dispatch(new hikeEditPoiActions.SetOsmNaturalPoiSelected(poi.id));
        break;
      case EPoiTypes.osmRoute:
        this._store.dispatch(new hikeEditPoiActions.SetOsmRoutePoiSelected(poi.id));
        break;
    }
  }

  public invertSelection() {
    this.pois$.take(1).subscribe(pois => {
      const clickablePois = pois.filter(p => {
        return !!p.onRoute === this.onRouteCheck && !p.inCollector && !p.inGtrackDb;
      });

      for (const poi of clickablePois) {
        this.handlePoiSelection(poi);
      }
    });
  }
}
