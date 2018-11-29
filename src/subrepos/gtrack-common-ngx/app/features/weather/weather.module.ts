import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { WeatherService } from './services';
import { WeatherInfoComponent, WeatherIconComponent, WindDirectionIconComponent } from './components';

import {
  WeatherEffects,
  WeatherSelectors,
  WEATHER_REDUCER_TOKEN,
  featureName,
  getReducers
} from './store';

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    EffectsModule.forFeature([WeatherEffects]),
    StoreModule.forFeature(featureName, WEATHER_REDUCER_TOKEN),
    AngularSvgIconModule
  ],
  declarations: [
    WeatherInfoComponent,
    WeatherIconComponent,
    WindDirectionIconComponent
  ],
  exports: [
    WeatherIconComponent,
    WindDirectionIconComponent
  ],
  providers: [
    WeatherService,
    WeatherEffects,
    WeatherSelectors,
    {
      provide: WEATHER_REDUCER_TOKEN,
      useFactory: getReducers
    }
  ],
})
export class WeatherModule { }
