import { Injectable } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { State, commonRouteActions, commonHikeActions } from 'app/store';
import { HikeEditRoutePlannerSelectors } from 'app/store/selectors';
import { ReverseGeocodingService } from '../hike-data/reverse-geocoding.service';
import { ITextualDescriptionItem, IGTrackPoi } from '../../interfaces';
import { ILocalizedItem, ITextualDescription, IPoi, IPoiStored } from 'subrepos/provider-client';
import { PoiSelectors } from 'subrepos/gtrack-common-ngx';

import * as uuid from 'uuid/v1';
import * as _ from 'lodash';
import * as moment from 'moment';

@Injectable()
export class HikeDataService {
  constructor(
    private _store: Store<State>,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _poiSelectors: PoiSelectors,
    private _reverseGeocodingService: ReverseGeocodingService
  ) {}

  /**
   * collectHikeData effect submethod
   */
  /*
  public collectHikeStops() {
    return this._store
      .select(this._hikeEditGeneralInfoSelectors.getHikePois<(IPoiStored)>(this._poiSelectors.getAllPois))
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
  */

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
}
