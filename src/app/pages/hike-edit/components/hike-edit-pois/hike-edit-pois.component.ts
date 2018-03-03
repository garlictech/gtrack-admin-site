
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, hikeEditPoiActions } from 'app/store';
import { IExternalPoiType } from 'app/shared/interfaces/index';

@Component({
  selector: 'gt-hike-edit-pois',
  templateUrl: './hike-edit-pois.component.html'
})
export class HikeEditPoisComponent {
  public externalPoiTypes: IExternalPoiType[] = [
    {
      title: 'Wikipedia pois',
      subdomain: 'wikipedia',
      getAction: 'GetWikipediaPois'
    }, {
      title: 'Google pois',
      subdomain: 'google',
      getAction: 'GetGooglePois'
    }, {
      title: 'OSM Natural pois',
      subdomain: 'osmNatural',
      getAction: 'GetOsmNaturalPois'
    }, {
      title: 'OSM Amenity pois',
      subdomain: 'osmAmenity',
      getAction: 'GetOsmAmenityPois'
    }, {
      title: 'OSM Route pois',
      subdomain: 'osmRoute',
      getAction: 'GetOsmRoutePois'
    }
  ];

  constructor(
    private _store: Store<State>
  ) {
    this._store.dispatch(new hikeEditPoiActions.ResetPoiState());
  }
}
