// Core
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { IExternalPoi } from 'app/shared/interfaces/index';
import { LanguageService } from 'app/shared/services';
import { State, hikeEditPoiActions } from 'app/store';
import { EPoiTypes } from 'subrepos/provider-client';

@Component({
  selector: 'hike-edit-pois-external-table',
  templateUrl: './ui.html'
})
export class HikeEditPoisExternalTableComponent {
  @Input() pois$: IExternalPoi[];
  @Input() subdomain: string;
  @Input() onRouteCheck: boolean;
  @Input() openPoiModal: any;

  constructor(
    private _store: Store<State>
  ) {}

  public handleInHikePoi($event, poi) {
    $event.stopPropagation();

    switch (this.subdomain) {
      case EPoiTypes.google:
        this._store.dispatch(new hikeEditPoiActions.SetGooglePoiInHike(poi.id, !poi.inHike));
        break;
      case EPoiTypes.wikipedia:
        this._store.dispatch(new hikeEditPoiActions.SetWikipediaPoiInHike(poi.id, !poi.inHike));
        break;
      case EPoiTypes.osmAmenity:
        this._store.dispatch(new hikeEditPoiActions.SetOsmAmenityPoiInHike(poi.id, !poi.inHike));
        break;
      case EPoiTypes.osmNatural:
        this._store.dispatch(new hikeEditPoiActions.SetOsmNaturalPoiInHike(poi.id, !poi.inHike));
        break;
      case EPoiTypes.osmRoute:
        this._store.dispatch(new hikeEditPoiActions.SetOsmRoutePoiInHike(poi.id, !poi.inHike));
        break;
    }
  }

  public translateDescription(description, field) {
    return LanguageService.translateDescription(description, field);
  }
}
