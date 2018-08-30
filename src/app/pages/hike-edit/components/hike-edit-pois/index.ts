
import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, hikeEditPoiActions } from '../../../../store';
import { IExternalPoiType } from '../../../../shared/interfaces';
import { EPoiTypes } from 'subrepos/provider-client';
import { Observable } from 'rxjs';

@Component({
  selector: 'gt-hike-edit-pois',
  templateUrl: './ui.html'
})
export class HikeEditPoisComponent implements OnInit {
  @Input() isPlanning$: Observable<boolean>;

  public externalPoiTypes: IExternalPoiType[] = [
    {
      title: 'Wikipedia pois',
      subdomain: EPoiTypes.wikipedia,
      getAction: 'GetWikipediaPois'
    }, {
      title: 'Google pois',
      subdomain: EPoiTypes.google,
      getAction: 'GetGooglePois'
    }, {
      title: 'OSM Natural pois',
      subdomain: EPoiTypes.osmNatural,
      getAction: 'GetOsmNaturalPois'
    }, {
      title: 'OSM Amenity pois',
      subdomain: EPoiTypes.osmAmenity,
      getAction: 'GetOsmAmenityPois'
    } /*, {
      title: 'OSM Route pois',
      subdomain: EPoiTypes.osmRoute,
      getAction: 'GetOsmRoutePois'
    }*/
  ];

  constructor(
    private _store: Store<State>
  ) {}

  ngOnInit() {
    this._store.dispatch(new hikeEditPoiActions.ResetPoiState());
  }
}
