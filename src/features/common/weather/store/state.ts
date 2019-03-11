import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { OpenWeatherMapForecast } from '../interfaces';

export interface WeatherEntity extends OpenWeatherMapForecast {
  id: string;
}

export const weatherAdapter = createEntityAdapter<WeatherEntity>();
export interface WeatherEntityState extends EntityState<WeatherEntity> {}

export interface WeatherContextState {
  id: string;
  loading: boolean;
  loaded: boolean;
}

export interface AllWeatherContextState extends EntityState<WeatherContextState> {}

export const weatherContextAdapter = createEntityAdapter<WeatherContextState>();

export interface WeatherState {
  weathers: WeatherEntityState;
  contexts: AllWeatherContextState;
}

export const featureName = 'features.weather';
