import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { JsonpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { DynamicModalModule } from './dynamic-modal';
import { MapModule, MapComponentsModule } from './map';
import { HikeComponentsModule, HikeModule, PoiSelectors } from './hike';
import { RouterModule } from './router';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    JsonpModule,
    MapModule,
    MapComponentsModule,
    HikeModule,
    RouterModule,
    HikeComponentsModule,
    DynamicModalModule
  ],
  declarations: [],
  providers: [PoiSelectors],
  exports: []
})
export class GtrackCommonModule {}