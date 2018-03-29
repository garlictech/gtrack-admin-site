import { Injectable } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { State, hikeEditGeneralInfoActions, commonRouteActions } from 'app/store';
import { HikeEditGeneralInfoSelectors, HikeEditRoutePlannerSelectors } from 'app/store/selectors';
import { ReverseGeocodingService } from '../hike-data/reverse-geocoding.service';
import { ITextualDescriptionItem } from '../../interfaces';
import { IHikeProgram, ILocalizedItem, ITextualDescription } from 'subrepos/provider-client';

import * as uuid from 'uuid/v1';
import * as _ from 'lodash';

@Injectable()
export class HikeDataService {
  constructor(
    private _store: Store<State>,
    private _hikeEditGeneralInfoSelectors: HikeEditGeneralInfoSelectors,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _reverseGeocodingService: ReverseGeocodingService
  ) {}

  /**
   * collectHikeData effect submethod
   */
  public collectHikeGeneralInfo() {
    return this._store.select(this._hikeEditGeneralInfoSelectors.getGeneralInfo)
      .take(1)
      .map((generalInfo) => {
        return {
          id: generalInfo.hikeId,
          routeId: generalInfo.routeId,
          difficulty: generalInfo.difficulty.toString(), // TODO it will be number!!
          isRoundTrip: generalInfo.isRoundTrip,
          pois: generalInfo.pois
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
    return this._store.select(this._hikeEditRoutePlannerSelectors.getRoutePlanner)
      .take(1)
      .map((routeInfo) => {
        let _routeInfo: any = _.pick(routeInfo.total, [
          'distance', 'uphill', 'downhill', 'time', 'score',
          'isRoundTrip', 'difficulty', 'rate', 'routeIcon',
          'elevationIcon'
        ]);

        // TEST DATA FOR STOPS ====>
        console.warn('TODO: collectHikeRouteInfo - Temporary stops array from markers');
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
  public collectHikeLocation(data) {
    return new Promise((resolve, reject) => {
      if (!data.stops[0]) {
        resolve({ location: 'n/a' });
      }

      let _startPoint = {
        lat: data.stops[0].lat,
        lon: data.stops[0].lon
      }

      this._reverseGeocodingService.get(_startPoint).then((location) => {
        resolve({ location: location });
      }, (err) => {
        resolve({location: 'n/a'});
      });
    });
  }

  /**
   * Split hike data to store
   */
  public splitHikeDataToStore(hikeData: IHikeProgram) {
    // Set route id and load route data
    this._store.dispatch(new hikeEditGeneralInfoActions.SetRouteId({
      routeId: hikeData.routeId
    }));
    this._store.dispatch(new commonRouteActions.LoadRoute(hikeData.routeId));

    // General info
    this._store.dispatch(new hikeEditGeneralInfoActions.SetIsRoundTrip({
      isRoundTrip: hikeData.isRoundTrip,
    }));
    this._store.dispatch(new hikeEditGeneralInfoActions.SetDifficulty({
      difficulty: parseInt(hikeData.difficulty) // TODO: it will be number!
    }));

    // Descriptions
    this._splitHikeDescriptionToStore(hikeData.description);

    // General info
    this._store.dispatch(new hikeEditGeneralInfoActions.SetInitialized());
  }

  /**
   * splitHikeDataToStore submethod
   */
  private _splitHikeDescriptionToStore(descriptions: ILocalizedItem<ITextualDescription>) {
    let descriptionArray: ITextualDescriptionItem[] = [];
    for (let key of Object.keys(descriptions)) {
      descriptionArray.push(_.merge(_.cloneDeep(descriptions[key]), {id: key}));
    }

    this._store.dispatch(new hikeEditGeneralInfoActions.SetDescriptions({
      descriptions: descriptionArray
    }));
  }
}
