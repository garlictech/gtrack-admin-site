import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

import {
  LanguageSelectorComponent as LanguageSelectorComponentBase,
  LanguageService
} from '@bit/garlictech.angular-features.common.localization';

import { currentLanguage } from '@bit/garlictech.angular-features.common.localization/store/selectors';

@Component({
  selector: 'gtrack-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent extends LanguageSelectorComponentBase implements OnInit {
  allLanguages: any;
  selectedLanguage: any;

  constructor(_languageService: LanguageService, private readonly _store: Store<any>) {
    super(_languageService);
    this.supportedLanguages = _languageService.getSupportedLanguages();
  }

  ngOnInit(): void {
    this.allLanguages = this.supportedLanguages.map(lang => ({
      label: lang.title,
      value: lang
    }));

    this._store
      .pipe(
        select(currentLanguage),
        take(1)
      )
      .subscribe(selected => {
        this.selectedLanguage = this.allLanguages.find(lang => lang.value.id === selected);
      });
  }
  setLanguage(language: string): void {
    this._languageService.setLanguage(language);
  }
}
