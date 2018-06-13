import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { LanguageService } from '../language-service';
import { ILanguageDesc } from '../languages';

@Component({
  selector: 'pioneer-wst-language-selector',
  template: '<h1>Language Selector Module - Tb Be Redefined</h1>',
  styles: ['']
})
export class LanguageSelectorComponent {
  supportedLanguages: ILanguageDesc[];

  constructor(protected _languageService: LanguageService) {
    this._init();
  }

  setLanguage(language: string) {
    this._languageService.setLanguage(language);
  }

  _init() {
    this.supportedLanguages = this._languageService.getSupportedLanguages();
  }
}
