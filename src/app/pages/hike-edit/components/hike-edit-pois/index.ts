import { Observable } from 'rxjs';

import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { EPoiTypes } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { ExternalPoiType } from '../../../../shared/interfaces';
import { State } from '../../../../store';
import { hikeEditPoiActions } from '../../../../store/actions';

@Component({
  selector: 'app-hike-edit-pois',
  templateUrl: './ui.html'
})
export class HikeEditPoisComponent implements OnInit {
  @Input() isPlanning$: Observable<boolean>;

  externalPoiTypes: Array<ExternalPoiType>;

  constructor(private readonly _store: Store<State>) {
    this.externalPoiTypes = [
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
      }
    ];
  }

  ngOnInit(): void {
    this._store.dispatch(new hikeEditPoiActions.ResetPoiState());
  }

  trackByFn(index: number): number {
    return index;
  }
}
