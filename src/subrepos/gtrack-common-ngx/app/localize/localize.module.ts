import { NgModule } from '@angular/core';
import { LocalizeDescriptionPipe } from './pipes/localize-description.pipe';
import { LocalizeSelectors } from './store';
import { DescriptionLanguageListService } from './services';
import { DescriptionComponent } from './components';

const COMPONENTS = [
  LocalizeDescriptionPipe,
  DescriptionComponent
];

@NgModule({
  imports: [],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS],
  providers: [
    LocalizeSelectors,
    DescriptionLanguageListService
  ],
})
export class LocalizeModule { }
