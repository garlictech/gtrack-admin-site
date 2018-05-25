import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HikeListComponent } from './hike-list.component';
import { GpxInputComponent } from './components';

const COMPONENTS = [
  HikeListComponent,
  GpxInputComponent,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS],
  entryComponents: [...COMPONENTS]
})
export class HikeListModule {}
