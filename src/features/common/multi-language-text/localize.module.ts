import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DescriptionComponent } from './components';
import { LocalizeDescriptionPipe } from './pipes/localize-description.pipe';
import { DescriptionLanguageListService } from './services';
import { LocalizeSelectors } from './store';

const COMPONENTS = [LocalizeDescriptionPipe, DescriptionComponent];

@NgModule({
  imports: [CommonModule],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS],
  providers: [LocalizeSelectors, DescriptionLanguageListService]
})
export class MultiLanguageTextModule {}
