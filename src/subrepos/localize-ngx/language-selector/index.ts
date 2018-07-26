import { Component } from '@angular/core';
import { LanguageService } from '../language-service';
import { ILanguageDesc } from '../languages';

@Component({
  selector: 'garlictech-language-selector',
  template: ''
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
