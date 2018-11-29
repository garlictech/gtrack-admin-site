import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { IOpenWeatherMapForecast } from '../interfaces';

export interface IWeatherEntity extends IOpenWeatherMapForecast {
  id: string;
}

export const weatherAdapter = createEntityAdapter<IWeatherEntity>();
export interface IWeatherEntityState extends EntityState<IWeatherEntity> {}

export interface IWeatherContextState {
  id: string;
  loading: boolean;
  loaded: boolean;
}

export interface IAllWeatherContextState extends EntityState<IWeatherContextState> {}

export const weatherContextAdapter = createEntityAdapter<IWeatherContextState>();

export interface IWeatherState {
  weathers: IWeatherEntityState;
  contexts: IAllWeatherContextState;
}

export const featureName = 'features.weather';
