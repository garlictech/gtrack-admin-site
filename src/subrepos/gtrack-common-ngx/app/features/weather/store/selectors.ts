import { Injectable } from '@angular/core';
import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';

import {
  weatherAdapter,
  weatherContextAdapter,
  IWeatherState,
  IWeatherContextState,
  IWeatherEntity,
  featureName
} from './state';

@Injectable()
export class WeatherSelectors {
  public selectFeature: MemoizedSelector<object, IWeatherState>;
  public getAllWeathers: (state: object) => IWeatherEntity[];
  public getAllContexts: (state: object) => IWeatherContextState[];

  constructor() {
    this.selectFeature = createFeatureSelector<IWeatherState>(featureName);

    const weatherSelector = createSelector(
      this.selectFeature,
      (state: IWeatherState) => state.weathers
    );
    const contextSelector = createSelector(
      this.selectFeature,
      (state: IWeatherState) => state.contexts
    );

    const selectors = weatherAdapter.getSelectors(weatherSelector);
    const contextSelectors = weatherContextAdapter.getSelectors(contextSelector);

    this.getAllWeathers = selectors.selectAll;
    this.getAllContexts = contextSelectors.selectAll;
  }

  public getWeather(position: GeoJSON.Position) {
    const context = `${position[0]}-${position[1]}`;
    return createSelector(
      this.getAllWeathers,
      (weathers: IWeatherEntity[]) => weathers.find(weather => weather.id === context)
    );
  }

  public getWeatherContext(position: GeoJSON.Position) {
    const id = `${position[0]}-${position[1]}`;

    return createSelector(
      this.getAllContexts,
      contexts => {
        return contexts.find(context => context.id === id);
      }
    );
  }
}
