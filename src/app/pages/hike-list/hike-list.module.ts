import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HikeListComponent } from './hike-list.component';
import { GpxInputComponent } from './components';
import { SharedComponentsModule } from 'app/shared/components';

import { ButtonModule, SelectButtonModule, FileUploadModule, CardModule, } from 'primeng/primeng';
import { TableModule } from 'primeng/table';

const COMPONENTS = [
  HikeListComponent,
  GpxInputComponent
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedComponentsModule,
    FormsModule,
    // PrimeNG
    ButtonModule,
    SelectButtonModule,
    FileUploadModule,
    CardModule,
    TableModule
  ],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS],
  entryComponents: [...COMPONENTS]
})
export class HikeListModule {}
