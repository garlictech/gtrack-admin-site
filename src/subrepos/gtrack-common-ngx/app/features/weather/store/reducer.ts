import { ActionReducer, combineReducers, ActionReducerMap } from '@ngrx/store';

import {
  IAllWeatherContextState,
  weatherContextAdapter,
  IWeatherEntityState,
  IWeatherState,
  weatherAdapter
} from './state';

import { AllWeatherActions, WeatherActionTypes } from './actions';

export const weatherContextReducerIntialState = weatherContextAdapter.getInitialState();
export const weatherReducerInitialState = weatherAdapter.getInitialState();

const contextReducer: ActionReducer<IAllWeatherContextState> = (
  state: IAllWeatherContextState = weatherContextReducerIntialState,
  action: AllWeatherActions
): IAllWeatherContextState => {
  switch (action.type) {
    case WeatherActionTypes.GET_FORECAST:
      return weatherContextAdapter.upsertOne(
        {
          id: `${action.position[0]}-${action.position[1]}`,
          loading: true,
          loaded: false
        },
        state
      );

    case WeatherActionTypes.FORECAST_RETURNED:
      return weatherContextAdapter.upsertOne(
        {
          id: action.forecast.id,
          loading: false,
          loaded: true
        },
        state
      );

    default:
      return state;
  }
};

const reducer: ActionReducer<IWeatherEntityState> = (
  state: IWeatherEntityState = weatherReducerInitialState,
  action: AllWeatherActions
): IWeatherEntityState => {
  switch (action.type) {
    case WeatherActionTypes.FORECAST_RETURNED:
      return weatherAdapter.upsertOne(action.forecast, state);

    default:
      return state;
  }
};

const reducerMap: ActionReducerMap<IWeatherState> = {
  contexts: contextReducer,
  weathers: reducer
};

export const weatherReducer = combineReducers(reducerMap);
