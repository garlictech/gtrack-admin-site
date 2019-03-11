import { Injectable } from '@angular/core';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import {
  featureName,
  weatherAdapter,
  weatherContextAdapter,
  WeatherContextState,
  WeatherEntity,
  WeatherState
} from './state';

@Injectable()
export class WeatherSelectors {
  selectFeature: MemoizedSelector<object, WeatherState>;
  getAllWeathers: (state: object) => Array<WeatherEntity>;
  getAllContexts: (state: object) => Array<WeatherContextState>;

  constructor() {
    this.selectFeature = createFeatureSelector<WeatherState>(featureName);

    const weatherSelector = createSelector(
      this.selectFeature,
      (state: WeatherState) => state.weathers
    );
    const contextSelector = createSelector(
      this.selectFeature,
      (state: WeatherState) => state.contexts
    );

    const selectors = weatherAdapter.getSelectors(weatherSelector);
    const contextSelectors = weatherContextAdapter.getSelectors(contextSelector);

    this.getAllWeathers = selectors.selectAll;
    this.getAllContexts = contextSelectors.selectAll;
  }

  getWeather(position: GeoJSON.Position): MemoizedSelector<object, WeatherEntity> {
    const context = `${position[0]}-${position[1]}`;

    return createSelector(
      this.getAllWeathers,
      (weathers: Array<WeatherEntity>) => weathers.find(weather => weather.id === context)
    );
  }

  getWeatherContext(position: GeoJSON.Position): MemoizedSelector<object, WeatherContextState> {
    const id = `${position[0]}-${position[1]}`;

    return createSelector(
      this.getAllContexts,
      contexts => contexts.find(context => context.id === id)
    );
  }
}
