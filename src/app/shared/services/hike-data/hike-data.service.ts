import { Injectable } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { PoiSelectors } from 'subrepos/gtrack-common-ngx';

import { State } from 'app/store';
import { HikeEditGeneralInfoSelectors } from 'app/store/selectors';

import * as uuid from 'uuid/v4';
import * as _ from 'lodash';

// TODO del
import { MOCK_HIKE_LIST, MOCK_HIKE_DATA } from '../../../mock-data';
import { ReverseGeocodingService } from '../hike-data/reverse-geocoding.service';

@Injectable()
export class HikeDataService {
  constructor(
    private _store: Store<State>,
    private _hikeEditGeneralInfoSelectors: HikeEditGeneralInfoSelectors,
    private _poiSelectors: PoiSelectors,
    private _reverseGeocodingService: ReverseGeocodingService
  ) {}

  public getHikes() {
    return MOCK_HIKE_LIST;
  }

  public getHike(id) {
    return MOCK_HIKE_DATA;
  }

  /**
   * collectHikeData effect submethod
   */
  public collectHikeGeneralInfo() {
    return this._store.select((state: State) => state.hikeEditGeneralInfo.generalInfo)
      .take(1)
      .map((generalInfo) => {
        return {
          id: generalInfo.hikeId,
          routeId: generalInfo.routeId
        };
      });
  }

  /**
   * collectHikeData effect submethod
   */
  public collectHikeDescriptions() {
    let _textualDescriptions$ = this._store.select(
      this._hikeEditGeneralInfoSelectors.getAllDescriptions
    );

    return _textualDescriptions$
      .take(1)
      .map((descriptions) => {
        return descriptions;
      });
  }

  /**
   * collectHikeData effect submethod
   */
  public collectHikeRouteInfo() {
    return this._store.select((state: State) => state.routeInfoData.total)
      .take(1)
      .map((routeInfoTotal) => {
        return _.pick(routeInfoTotal, [
          'distance', 'uphill', 'downhill', 'time', 'score',
          'isRoundTrip', 'difficulty', 'rate', 'routeIcon',
          'elevationIcon'
        ]);
      });
  }

  /**
   * collectHikeData effect submethod
   */
  public collectHikePois() {
    let _pois$ = this._store.select(
      this._poiSelectors.getPoiIds
    );

    return _pois$
      .take(1)
      .map((poiIds) => {
        return poiIds;
      });
  }

  /**
   * collectHikeData effect submethod
   */
  public collectHikeLocation() {
    return new Promise((resolve, reject) => {
      let _pois$ = this._store.select(
        this._poiSelectors.getAllPois
      );

      _pois$
        .take(1)
        .subscribe((pois) => {
          if (!pois[0]) {
            resolve({location: 'n/a'});
          }

          let _startPoint = {
            lon: pois[0].lon,
            lat: pois[0].lat
          }

          this._reverseGeocodingService.get(_startPoint).then((location) => {
            resolve({location: location});
          }, (err) => {
            resolve({location: 'n/a'});
          });
        });
    });
  }
}
