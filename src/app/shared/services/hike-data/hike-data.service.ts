import { Injectable } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { PoiSelectors } from 'subrepos/gtrack-common-ngx';

import { State } from 'app/store';
import { HikeEditGeneralInfoSelectors } from 'app/store/selectors';

import * as uuid from 'uuid/v1';
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
          routeId: generalInfo.routeId,
          difficulty: generalInfo.difficulty.toString(), // TODO it will be number!!
          isRoundTrip: generalInfo.isRoundTrip
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
    return this._store.select((state: State) => state.hikeEditRoutePlanner)
      .take(1)
      .map((routeInfo) => {
        let _routeInfo: any = _.pick(routeInfo.total, [
          'distance', 'uphill', 'downhill', 'time', 'score',
          'isRoundTrip', 'difficulty', 'rate', 'routeIcon',
          'elevationIcon'
        ]);

        // TEST DATA FOR STOPS ====>
        console.error('TODO: collectHikeRouteInfo - Temporary stops array from markers');
        _routeInfo.stops = [];

        for (let i = 1; i < routeInfo.route.features.length; i++) {
          let _feature = routeInfo.route.features[i];
          let _segment: any = {
            uphill: 0,
            downhill: 0,
            distance: 0,
            score: 0,
            time: 0
          };

          if (i > 1) {
            _segment = _.pick(routeInfo.segments[i - 2], [
              'uphill', 'downhill', 'distance', 'score', 'time'
            ])
          }

          if (_feature.geometry.type === 'Point') {
            _routeInfo.stops.push({
              distanceFromOrigo: _segment.distance,
              isCheckpoint: false,
              poiId: 'fakeId',
              lat: _feature.geometry.coordinates[1],
              lon: _feature.geometry.coordinates[0],
              segment: _segment
            });
          }
        }

        // <=== TEST DATA FOR STOPS

        return _routeInfo;
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
            resolve({ location: 'n/a' });
          }

          let _startPoint = {
            lon: pois[0].lon,
            lat: pois[0].lat
          }

          this._reverseGeocodingService.get(_startPoint).then((location) => {
            resolve({ location: location });
          }, (err) => {
            resolve({location: 'n/a'});
          });
        });
    });
  }
}
