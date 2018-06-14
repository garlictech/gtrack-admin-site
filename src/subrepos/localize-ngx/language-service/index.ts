import { Injectable, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ILocalizeConfig } from '../lib/config';
import { Languages, ILanguageDesc } from '../languages';
import { log, DebugLog } from '../log';

@Injectable()
export class LanguageService {
  private _supportedLanguages: any[];

  constructor(private _translate: TranslateService, @Inject('LOCALIZE_CONFIG') private _config: ILocalizeConfig) {
    this._init();
  }

  setLanguage(languageCode: string) {
    this._translate.use(languageCode);
    localStorage.setItem('actualLanguage', languageCode);
  }

  getAllLanguages(): ILanguageDesc[] {
    return [...Languages];
  }

  getLanguageDescOfId(languageId: string): ILanguageDesc | undefined {
    return Languages.find(lang => lang.id === languageId);
  }

  getSupportedLanguages(): ILanguageDesc[] {
    return this._supportedLanguages;
  }

  @DebugLog
  _init() {
    this._translate.addLangs(this._config.supportedLanguages);
    this._translate.setDefaultLang(this._config.defaultLanguage);
    let actualLanguage: string | null = localStorage.getItem('actualLanguage');

    if (!actualLanguage) {
      const browserLang = this._translate.getBrowserCultureLang().replace(/-/, '_') || 'en_US';
      log.d(`Detected browser language: ${browserLang}`);
      actualLanguage =
        this._config.supportedLanguages.indexOf(browserLang) > -1 ? browserLang : this._config.defaultLanguage;
    }

    this._translate.use(actualLanguage);
    this._supportedLanguages = Languages.filter(lang => this._config.supportedLanguages.indexOf(lang.id) > -1);
    log.d('Supported languages: ', this._supportedLanguages);
  }
}
