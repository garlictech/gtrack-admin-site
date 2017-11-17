import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { HikeEditPoiActions } from './actions';
import { OsmPoiService } from '../../shared/services/poi/osm-poi.service';

@Injectable()
export class HikeEditPoiEffects {
  constructor(
    private _actions$: Actions,
    private _osmPoiService: OsmPoiService
  ) {}

  @Effect()
    getOsmPois$: Observable<Action> = this._actions$
      .ofType(HikeEditPoiActions.GET_OSM_POIS)
      .map(toPayload)
      .switchMap(data => {
        console.log('getOsmPois effect', data);
        this._osmPoiService.get(data.bounds, data.poiType).then((val) => {
          console.log('val', val);
        });

        return Observable.empty<Response>();
      });
}
