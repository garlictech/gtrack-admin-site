import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DialogModule } from 'primeng/dialog';

import { WeatherModule as BaseModule } from '@bit/garlictech.angular-features.common.weather';
import { WeatherInfoComponent } from './components';

@NgModule({
  imports: [BaseModule, CommonModule, DialogModule, AngularSvgIconModule],
  exports: [WeatherInfoComponent],
  declarations: [WeatherInfoComponent],
  providers: []
})
export class WeatherModule {}
