import { Observable } from 'rxjs';
import { EPoiTypes } from 'subrepos/provider-client';

import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { IExternalPoiType } from '../../../../shared/interfaces';
import { State } from '../../../../store';
import { hikeEditPoiActions } from '../../../../store/actions';

@Component({
  selector: 'app-hike-edit-pois',
  templateUrl: './ui.html'
})
export class HikeEditPoisComponent implements OnInit {
  @Input() isPlanning$: Observable<boolean>;

  externalPoiTypes: Array<IExternalPoiType> = [
    {
      title: 'Wikipedia pois',
      subdomain: EPoiTypes.wikipedia,
      getAction: 'GetWikipediaPois'
    },
    {
      title: 'Google pois',
      subdomain: EPoiTypes.google,
      getAction: 'GetGooglePois'
    },
    {
      title: 'OSM Natural pois',
      subdomain: EPoiTypes.osmNatural,
      getAction: 'GetOsmNaturalPois'
    },
    {
      title: 'OSM Amenity pois',
      subdomain: EPoiTypes.osmAmenity,
      getAction: 'GetOsmAmenityPois'
    } /*, {
      title: 'OSM Route pois',
      subdomain: EPoiTypes.osmRoute,
      getAction: 'GetOsmRoutePois'
    }*/
  ];

  constructor(private readonly _store: Store<State>) {}

  ngOnInit() {
    this._store.dispatch(new hikeEditPoiActions.ResetPoiState());
  }

  trackByFn(index: number): number {
    return index;
  }
}
