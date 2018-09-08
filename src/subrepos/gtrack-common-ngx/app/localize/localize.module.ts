import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalizeDescriptionPipe } from './pipes/localize-description.pipe';
import { LocalizeSelectors } from './store';
import { DescriptionLanguageListService } from './services';
import { DescriptionComponent } from './components';

import { SharedModule } from '../shared';

const COMPONENTS = [LocalizeDescriptionPipe, DescriptionComponent];

@NgModule({
  imports: [SharedModule, CommonModule],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS],
  providers: [LocalizeSelectors, DescriptionLanguageListService]
})
export class LocalizeModule {}
