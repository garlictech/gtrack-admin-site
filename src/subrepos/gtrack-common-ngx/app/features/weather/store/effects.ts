import { map, take, mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';

import { WeatherService } from '../services';
import * as LocalActions from './actions';

@Injectable()
export class WeatherEffects {
  @Effect()
  public getForecast$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.GetForecast>(LocalActions.WeatherActionTypes.GET_FORECAST),
    mergeMap(action => {
      return this._weatherService.getWeather(action.position).pipe(
        take(1),
        map(forecast => {
          return new LocalActions.ForecastReturned({
            ...forecast,
            id: `${action.position[0]}-${action.position[1]}`
          });
        })
      );
    })
  );

  constructor(private _actions$: Actions, private _weatherService: WeatherService) {}
}
