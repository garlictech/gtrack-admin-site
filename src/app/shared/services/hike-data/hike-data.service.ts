import { Injectable } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { State, hikeEditGeneralInfoActions, commonRouteActions, commonHikeActions } from 'app/store';
import { HikeEditGeneralInfoSelectors, HikeEditRoutePlannerSelectors } from 'app/store/selectors';
import { IGeneralInfoState } from 'app/store/state';
import { ReverseGeocodingService } from '../hike-data/reverse-geocoding.service';
import { ITextualDescriptionItem, IGTrackPoi } from '../../interfaces';
import { IHikeProgram, ILocalizedItem, ITextualDescription, IPoi } from 'subrepos/provider-client';
import { PoiSelectors } from 'subrepos/gtrack-common-ngx';

import * as uuid from 'uuid/v1';
import * as _ from 'lodash';
import * as moment from 'moment';

@Injectable()
export class HikeDataService {
  constructor(
    private _store: Store<State>,
    private _hikeEditGeneralInfoSelectors: HikeEditGeneralInfoSelectors,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _poiSelectors: PoiSelectors,
    private _reverseGeocodingService: ReverseGeocodingService
  ) {}

  /**
   * collectHikeData effect submethod
   */
  public collectHikeGeneralInfo() {
    return Observable.combineLatest(
      this._store.select(this._hikeEditGeneralInfoSelectors.getGeneralInfo).take(1),
      this._store.select(this._hikeEditRoutePlannerSelectors.getIsRoundTrip).take(1)
    ).map(([generalInfo, isRoundTrip]: [IGeneralInfoState, boolean]) => {
      return {
        id: generalInfo.hikeId,
        routeId: generalInfo.routeId,
        difficulty: generalInfo.difficulty,
        isRoundTrip: isRoundTrip,
        timestamp: moment().valueOf(),
        pois: generalInfo.pois // id list
      };
    });
  }

  /**
   * collectHikeData effect submethod
   */
  public collectHikeDescriptions() {
    let _textualDescriptions$ = this._store.select(this._hikeEditGeneralInfoSelectors.getAllDescriptions);

    return _textualDescriptions$.take(1).map(descriptions => {
      return descriptions;
    });
  }

  /**
   * collectHikeData effect submethod
   */
  public collectHikeRouteInfo() {
    return this._store
      .select(this._hikeEditRoutePlannerSelectors.getRoutePlanner)
      .take(1)
      .map(routeInfo => {
        let _routeInfo: any = _.pick(routeInfo.total, [
          'distance',
          'uphill',
          'downhill',
          'time',
          'score'
        ]);

        return _routeInfo;
      });
  }

  /**
   * collectHikeData effect submethod
   */
  public collectHikeStops() {
    return this._store
      .select(this._hikeEditGeneralInfoSelectors.getHikePois<(IPoi)>(this._poiSelectors.getAllPois))
      .take(1)
      .map(hikePois => {
        const stops: any[] = [];

        if (hikePois && hikePois.length > 0) {
          for (let poi of hikePois) {
            stops.push({
              distanceFromOrigo: (<IGTrackPoi>poi).distFromRoute, // TODO: w/ turf
              isCheckpoint: false, // TODO: from checkpoint array
              onRoute: (<IGTrackPoi>poi).onRoute || false,
              poiId: poi.id,
              lat: poi.lat,
              lon: poi.lon,
              segment: { // TODO: w/ turf
                uphill: 0,
                downhill: 0,
                distance: 0,
                score: 0,
                time: 0
              }
            });
          }
        }

        return {
          stops: stops
        };
      });
  }

  /**
   * collectHikeData effect submethod
   */
  public collectHikeLocation(data) {
    return new Promise((resolve, reject) => {
      if (!data.stops[0]) {
        resolve({ location: 'n/a' });
      }

      let _startPoint = {
        lat: data.stops[0].lat,
        lon: data.stops[0].lon
      };

      this._reverseGeocodingService.get(_startPoint).then(
        location => {
          resolve({ location: location });
        },
        err => {
          resolve({ location: 'n/a' });
        }
      );
    });
  }

  /**
   * Split hike data to store
   */
  public splitHikeDataToStore(hikeData: IHikeProgram) {
    // Set unsaved states
    this._store.dispatch(new commonHikeActions.HikeProgramModified(<string>hikeData.id));
    this._store.dispatch(new commonRouteActions.RouteModified(hikeData.routeId));

    // Set route id and load route data
    this._store.dispatch(
      new hikeEditGeneralInfoActions.SetRouteId({
        routeId: hikeData.routeId
      })
    );
    this._store.dispatch(new commonRouteActions.LoadRoute(hikeData.routeId));

    // General info
    this._store.dispatch(
      new hikeEditGeneralInfoActions.SetIsRoundTrip({
        isRoundTrip: hikeData.isRoundTrip
      })
    );
    this._store.dispatch(
      new hikeEditGeneralInfoActions.SetDifficulty({
        difficulty: hikeData.difficulty
      })
    );

    // Pois
    this._store.dispatch(
      new hikeEditGeneralInfoActions.SetPois({
        pois: hikeData.pois
      })
    );

    // Descriptions
    this._splitHikeDescriptionToStore(hikeData.description);

    // Store has been initialized
    this._store.dispatch(new hikeEditGeneralInfoActions.SetInitialized());
  }

  /**
   * splitHikeDataToStore submethod
   */
  private _splitHikeDescriptionToStore(descriptions: ILocalizedItem<ITextualDescription>) {
    let descriptionArray: ITextualDescriptionItem[] = [];
    for (let key of Object.keys(descriptions)) {
      descriptionArray.push(_.merge(_.cloneDeep(descriptions[key]), { id: key }));
    }

    this._store.dispatch(
      new hikeEditGeneralInfoActions.SetDescriptions({
        descriptions: descriptionArray
      })
    );
  }
}
