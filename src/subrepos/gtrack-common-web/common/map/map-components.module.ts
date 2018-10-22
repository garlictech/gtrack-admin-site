import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';

import { MarkerPopupComponent } from './marker-popup';
import { LocalizeModule } from 'subrepos/gtrack-common-ngx/app/localize';
import { SharedModule } from 'subrepos/gtrack-common-ngx/app/shared';
import { MapComponentsModule as BaseModule } from 'subrepos/gtrack-common-ngx/app/map';

import { HikeComponentsModule } from '../hike/hike-components.module';

const COMPONENTS = [MarkerPopupComponent];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    LocalizeModule,
    SharedModule,
    BaseModule,
    DialogModule,
    HikeComponentsModule
  ],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  entryComponents: [MarkerPopupComponent]
})
export class MapComponentsModule {}
