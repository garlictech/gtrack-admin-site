import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/primeng';

import { LocalizeModule, defaultLocalizeConfig } from 'subrepos/localize-ngx';

import { LanguageSelectorComponent } from './language-selector';
import { Selectors } from './store/selectors';

const languageConfig = {
  ...defaultLocalizeConfig,
  defaultLanguage: 'en_US',
  supportedLanguages: ['en_US', 'hu_HU']
};

@NgModule({
  imports: [CommonModule, FormsModule, DropdownModule, LocalizeModule.forRoot(languageConfig)],
  declarations: [LanguageSelectorComponent],
  providers: [Selectors],
  exports: [LocalizeModule, LanguageSelectorComponent]
})
export class LanguageModule {}

export { Actions, Reducer, ILocalizationState } from 'subrepos/localize-ngx';
export { Selectors };
