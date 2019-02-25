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
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class LanguageSelectorComponent extends LanguageSelectorComponentBase implements OnInit {
  allLanguages: any;
  selectedLanguage: string;

  constructor(_languageService: LanguageService, private readonly _store: Store<any>) {
    super(_languageService);
    this.supportedLanguages = _languageService.getSupportedLanguages();
  }

  ngOnInit(): void {
    this.allLanguages = this.supportedLanguages.map(lang => ({
      label: lang.name,
      value: lang
    }));

    this._store
      .pipe(
        select(currentLanguage),
        take(1)
      )
      .subscribe(selected => {
        const theLanguage = this.allLanguages.find(lang => lang.value.id === selected);
        this.selectedLanguage = theLanguage && theLanguage.value;
      });
  }
}
