import { Component, OnInit } from '@angular/core';
import { pipe } from 'rxjs';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { LanguageService, LanguageSelectorComponent as LanguageSelectorComponentBase } from 'subrepos/localize-ngx';

import { currentLanguage } from 'subrepos/localize-ngx/store/selectors';

@Component({
  selector: 'gtrack-language-selector',
  templateUrl: './ui.pug',
  styleUrls: ['./style.scss']
})
export class LanguageSelectorComponent extends LanguageSelectorComponentBase implements OnInit {
  allLanguages: any;
  selectedLanguage: string;

  constructor(_languageService: LanguageService, private _store: Store<any>) {
    super(_languageService);
    this.supportedLanguages = _languageService.getSupportedLanguages();
  }

  ngOnInit() {
    this.allLanguages = this.supportedLanguages.map(lang => {
      return {
        label: lang.name,
        value: lang
      };
    });

    this._store
      .select(currentLanguage)
      .pipe(take(1))
      .subscribe(selected => {
        const theLanguage = this.allLanguages.find(lang => lang.value.id === selected);
        this.selectedLanguage = theLanguage && theLanguage.value;
      });
  }
}
