import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { AstronomyService } from './services';
import { SunriseComponent, MoonphaseIconComponent } from './components';

const DECLARATIONS = [
  SunriseComponent,
  MoonphaseIconComponent
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule,
    AngularSvgIconModule
  ],
  exports: DECLARATIONS,
  declarations: DECLARATIONS,
  providers: [
    AstronomyService
  ],
})
export class AstronomyModule { }
