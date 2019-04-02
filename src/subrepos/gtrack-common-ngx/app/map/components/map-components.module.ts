import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MultiLanguageTextModule } from '@features/common/multi-language-text';
import { SharedModule } from '../../shared';
import { IconComponent } from './icon';

// PrimeNG
import { ButtonModule } from 'primeng/button';

const COMPONENTS = [IconComponent];

@NgModule({
  imports: [
    CommonModule,
    MultiLanguageTextModule,
    // PrimeNG
    ButtonModule,
    SharedModule,
    RouterModule
  ],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS]
})
export class MapComponentsModule {}
