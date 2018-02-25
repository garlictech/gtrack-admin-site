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
  @Input() pois$: IExternalPoi[];
  @Input() subdomain: string;
  @Input() onRouteCheck: boolean;

  constructor(
    private _store: Store<State>
  ) {}

  public handleInHikePoi($event, poi) {
    $event.stopPropagation();

    switch (this.subdomain) {
      case 'google':
        this._store.dispatch(new hikeEditPoiActions.SetGooglePoiInHike({
          poiId: poi.id,
          isInHike: !poi.inHike
        }));
        break;
      case 'wikipedia':
        this._store.dispatch(new hikeEditPoiActions.SetWikipediaPoiInHike({
          poiId: poi.id,
          isInHike: !poi.inHike
        }));
        break;
      case 'osmAmenity':
        this._store.dispatch(new hikeEditPoiActions.SetOsmAmenityPoiInHike({
          poiId: poi.id,
          isInHike: !poi.inHike
        }));
        break;
      case 'osmNatural':
        this._store.dispatch(new hikeEditPoiActions.SetOsmNaturalPoiInHike({
          poiId: poi.id,
          isInHike: !poi.inHike
        }));
        break;
      case 'osmRoute':
        this._store.dispatch(new hikeEditPoiActions.SetOsmRoutePoiInHike({
          poiId: poi.id,
          isInHike: !poi.inHike
        }));
        break;
    }
  }
}
