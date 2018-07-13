import { Component, OnInit, Input } from '@angular/core';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Store } from '@ngrx/store';

import {
  ILocalizationState,
  LanguageService,
  LanguageSelectorComponent as LanguageSelectorComponentBase
} from 'subrepos/localize-ngx';
import { State } from '../../store';

const selectLangFeature = createFeatureSelector<ILocalizationState>('language');
const selectActualLangFeature = createSelector(selectLangFeature, (state: ILocalizationState) => state.actualLanguage);

@Component({
  selector: 'gtrack-language-selector',
  templateUrl: './ui.pug',
  styleUrls: ['./style.scss']
})
export class LanguageSelectorComponent extends LanguageSelectorComponentBase implements OnInit {
  @Input() selectedLanguage: string;
  allLanguages: any;

  constructor(_languageService: LanguageService, private _store: Store<State>) {
    super(_languageService);
    this.supportedLanguages = _languageService.getSupportedLanguages();
  }

  ngOnInit() {
    console.log('ngOnInit LanguageSelectorComponent');
    this.allLanguages = this.supportedLanguages.map(lang => {
      return {
        label: lang.name,
        value: lang
      };
    });
    this._store.select(selectActualLangFeature).subscribe(selected => {
      console.log('selectActualLangFeature', selected);
      let theLanguage = this.allLanguages.find(lang => lang.value.id === selected);
      this.selectedLanguage = theLanguage && theLanguage.value;
    });
  }
}
