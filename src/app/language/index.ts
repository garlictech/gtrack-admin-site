import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalizeModule, LocalizeConfig, LanguageService } from 'subrepos/localize-ngx';

const languageConfig = new LocalizeConfig();
languageConfig.defaultLanguage = 'en_US';
languageConfig.supportedLanguages = ['en_US'];

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
