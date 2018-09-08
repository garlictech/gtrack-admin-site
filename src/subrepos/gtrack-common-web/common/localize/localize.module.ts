import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DescriptionComponent } from './description';

import { LocalizeModule as BaseModule } from 'subrepos/gtrack-common-ngx/app/localize';

import { SharedModule } from 'subrepos/gtrack-common-ngx/app/shared';

const COMPONENTS = [DescriptionComponent];

@NgModule({
  imports: [BaseModule, SharedModule, CommonModule],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS],
  providers: []
})
export class LocalizeModule {}
