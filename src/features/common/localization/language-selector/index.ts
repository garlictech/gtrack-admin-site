import { Component } from '@angular/core';
import { LanguageService } from '../language-service';
import { LanguageDesc } from '../languages';

@Component({
  selector: 'garlictech-language-selector',
  template: ''
})
export class LanguageSelectorComponent {
  supportedLanguages: Array<LanguageDesc>;

  constructor(protected _languageService: LanguageService) {
    this._init();
  }

  setLanguage(language: string): void {
    this._languageService.setLanguage(language);
  }

  _init(): void {
    this.supportedLanguages = this._languageService.getSupportedLanguages();
  }
}
