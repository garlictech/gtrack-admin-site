import { Action } from '@ngrx/store';
import { IWeatherEntity } from './state';

export enum WeatherActionTypes {
  GET_FORECAST = '[Weather] Get forecast',
  FORECAST_RETURNED = '[Weather] Forecast returned'
}

export class GetForecast implements Action {
  readonly type = WeatherActionTypes.GET_FORECAST;

  constructor(public position: GeoJSON.Position) {}
}

export class ForecastReturned implements Action {
  readonly type = WeatherActionTypes.FORECAST_RETURNED;

  constructor(public forecast: IWeatherEntity) {}
}

export type AllWeatherActions = GetForecast | ForecastReturned;
