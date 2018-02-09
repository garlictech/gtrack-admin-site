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

@Injectable()
export class HikeDataService {
  constructor(
    private _store: Store<State>,
    private _hikeEditGeneralInfoSelectors: HikeEditGeneralInfoSelectors,
    private _poiSelectors: PoiSelectors
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
          'isRoundTrip', 'location', 'difficulty', 'rate'
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
}
