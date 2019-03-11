import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { LanguageDesc, Languages } from '../languages';
import { CONFIG, LocalizeConfig } from '../lib/config';
import { DebugLog, log } from '../log';

@Injectable()
export class LanguageService {
  private _supportedLanguages: Array<any>;

  constructor(private readonly _translate: TranslateService, @Inject(CONFIG) private readonly _config: LocalizeConfig) {
    this._init();
  }

  setLanguage(languageCode: string): void {
    this._translate.use(languageCode);
    localStorage.setItem('actualLanguage', languageCode);
  }

  getAllLanguages(): Array<LanguageDesc> {
    return [...Languages];
  }

  getLanguageDescOfId(languageId: string): LanguageDesc | undefined {
    return Languages.find(lang => lang.id === languageId);
  }

  getSupportedLanguages(): Array<LanguageDesc> {
    return this._supportedLanguages;
  }

  @DebugLog _init(): void {
    this._translate.addLangs(this._config.supportedLanguages);
    this._translate.setDefaultLang(this._config.defaultLanguage);
    let actualLanguage: string | null = localStorage.getItem('actualLanguage');

    if (!actualLanguage) {
      const browserCultureLang = this._translate.getBrowserCultureLang() || '';
      const browserLang = browserCultureLang.replace(/-/, '_') || 'en_US';
      log.data(`Detected browser language: ${browserLang}`);
      actualLanguage =
        this._config.supportedLanguages.indexOf(browserLang) > -1 ? browserLang : this._config.defaultLanguage;
    }

    this._translate.use(actualLanguage);
    this._supportedLanguages = Languages.filter(lang => this._config.supportedLanguages.indexOf(lang.id) > -1);
    log.data('Supported languages: ', this._supportedLanguages);
  }
}
