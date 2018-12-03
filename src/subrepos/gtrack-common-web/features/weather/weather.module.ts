import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { WeatherModule as BaseModule } from '@common.features/weather';
import { WeatherInfoComponent } from './components';

@NgModule({
  imports: [BaseModule, CommonModule, DialogModule, AngularSvgIconModule],
  exports: [WeatherInfoComponent],
  declarations: [WeatherInfoComponent],
  providers: []
})
export class WeatherModule {}
