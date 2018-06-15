import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalizeModule, defaultLocalizeConfig, LanguageService } from 'subrepos/localize-ngx';

const languageConfig = {
  ...defaultLocalizeConfig,
  defaultLanguage: 'en_US',
  supportedLanguages: ['en_US']
};

@NgModule({
  imports: [CommonModule, LocalizeModule.forRoot(languageConfig)],
  exports: [LocalizeModule]
})
export class LanguageModule {
  constructor(langService: LanguageService) {
    langService.setLanguage(languageConfig.defaultLanguage);
  }
}

export { Actions, Reducer, ILocalizationState } from 'subrepos/localize-ngx';
