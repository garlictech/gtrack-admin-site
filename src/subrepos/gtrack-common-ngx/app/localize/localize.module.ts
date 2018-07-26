import { NgModule } from '@angular/core';
import { LocalizeDescriptionPipe } from './pipes/localize-description.pipe';
import { LocalizeSelectors } from './store';
import { DescriptionLanguageListService } from './services';

@NgModule({
  imports: [],
  exports: [
    LocalizeDescriptionPipe
  ],
  declarations: [
    LocalizeDescriptionPipe
  ],
  providers: [
    LocalizeSelectors,
    DescriptionLanguageListService
  ],
})
export class LocalizeModule { }
