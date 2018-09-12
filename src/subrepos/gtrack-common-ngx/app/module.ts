import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { JsonpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';
import * as Raven from 'raven-js';

import { environment } from 'environments/environment';
import { MapModule, MapComponentsModule } from './map';
import { HikeComponentsModule, HikeModule, PoiSelectors } from './hike';
import { RouterModule } from './router';

console.log('ENVIRONMENT: ', environment);

if (environment.production) {
  Raven.config(environment.raven).install();
}

export class RavenErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    console.error(err);

    if (environment.production) {
      Raven.captureException(err);
    }
  }
}

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    JsonpModule,
    MapModule,
    MapComponentsModule,
    HikeModule,
    RouterModule,
    HikeComponentsModule
  ],
  declarations: [],
  providers: [PoiSelectors, { provide: ErrorHandler, useClass: RavenErrorHandler }],
  exports: []
})
export class GtrackCommonModule {}
