// Core
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { IExternalPoi } from '../../../../../shared/interfaces';
import { LanguageService } from '../../../../../shared/services';
import { State, hikeEditPoiActions } from '../../../../../store';
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

  public handlePoiSelection(poi) {
    switch (this.subdomain) {
      case EPoiTypes.google:
        this._store.dispatch(new hikeEditPoiActions.SetGooglePoiSelected(poi.id, !poi.selected));
        break;
      case EPoiTypes.wikipedia:
        this._store.dispatch(new hikeEditPoiActions.SetWikipediaPoiSelected(poi.id, !poi.selected));
        break;
      case EPoiTypes.osmAmenity:
        this._store.dispatch(new hikeEditPoiActions.SetOsmAmenityPoiSelected(poi.id, !poi.selected));
        break;
      case EPoiTypes.osmNatural:
        this._store.dispatch(new hikeEditPoiActions.SetOsmNaturalPoiSelected(poi.id, !poi.selected));
        break;
      case EPoiTypes.osmRoute:
        this._store.dispatch(new hikeEditPoiActions.SetOsmRoutePoiSelected(poi.id, !poi.selected));
        break;
    }
  }

  public translateDescription(description, field) {
    return LanguageService.translateDescription(description, field);
  }
}
