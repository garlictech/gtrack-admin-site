import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { HikeComponentsModule, HikeModule, PoiSelectors } from './hike';
import { MapComponentsModule } from './map';
import { RavenErrorHandler } from './raven';
import { RouterModule } from './router';

@NgModule({
  imports: [CommonModule, HttpClientModule, MapComponentsModule, HikeModule, RouterModule, HikeComponentsModule],
  declarations: [],
  providers: [PoiSelectors, { provide: ErrorHandler, useClass: RavenErrorHandler }],
  exports: []
})
export class GtrackCommonModule {}
