import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MultiLanguageTextModule } from '@bit/garlictech.angular-features.common.multi-language-text';
import { SharedComponentsModule } from '../../shared/components';
import { PipesModule } from '../../shared/pipes/pipes.module';
import { GpxInputComponent } from './components';
import { HikeListComponent } from './hike-list.component';

const COMPONENTS = [HikeListComponent, GpxInputComponent];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedComponentsModule,
    FormsModule,
    MultiLanguageTextModule,
    // PrimeNG
    ButtonModule,
    SelectButtonModule,
    FileUploadModule,
    CardModule,
    TableModule,
    PipesModule
  ],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS],
  entryComponents: [...COMPONENTS]
})
export class HikeListModule {}
