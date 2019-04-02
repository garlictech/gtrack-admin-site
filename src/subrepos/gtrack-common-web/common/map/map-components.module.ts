import { DialogModule } from 'primeng/dialog';
import { MapComponentsModule as BaseModule } from 'subrepos/gtrack-common-ngx/app/map';
import { SharedModule } from 'subrepos/gtrack-common-ngx/app/shared';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MultiLanguageTextModule } from '@features/common/multi-language-text';
import { TranslateModule } from '@ngx-translate/core';

import { HikeComponentsModule } from '../hike/hike-components.module';
import { LocalizeModule } from '../localize';
import { HikeDataPopupComponent } from './hike-data-popup';
import { MarkerPopupComponent } from './marker-popup';

const COMPONENTS = [MarkerPopupComponent, HikeDataPopupComponent];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MultiLanguageTextModule,
    SharedModule,
    BaseModule,
    DialogModule,
    HikeComponentsModule,
    LocalizeModule,
    TranslateModule
  ],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  entryComponents: [MarkerPopupComponent, HikeDataPopupComponent]
})
export class MapComponentsModule {}
