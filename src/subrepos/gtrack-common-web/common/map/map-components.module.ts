import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';

import { MultiLanguageTextModule } from '@features/common/multi-language-text';
import { MapComponentsModule as BaseModule } from 'subrepos/gtrack-common-ngx/app/map';
import { SharedModule } from 'subrepos/gtrack-common-ngx/app/shared';
import { MarkerPopupComponent } from './marker-popup';

import { HikeComponentsModule } from '../hike/hike-components.module';

const COMPONENTS = [MarkerPopupComponent];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MultiLanguageTextModule,
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
