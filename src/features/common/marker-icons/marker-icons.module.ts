import { AngularSvgIconModule } from 'angular-svg-icon';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MarkerIconService } from './services';

@NgModule({
  imports: [CommonModule, AngularSvgIconModule],
  providers: [MarkerIconService]
})
export class MarkerIconsModule {}
