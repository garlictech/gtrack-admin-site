import {
  Component,
  Input,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';
import { FormGroup } from '@angular/forms';

import { ITextualDescription, ILocalizedItem } from 'subrepos/provider-client';
import { TextboxField, TextareaField, EmojiField, IFormDescriptor } from 'app/forms';

import { State } from 'app/store';
import { DESCRIPTION_LANGUAGES, LanguageService } from 'app/shared/services';

@Component({
  selector: 'gt-localized-description',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalizedDescriptionComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input() descriptionSelector: any;
  @Input() submitFv: (langKey: string, data) => void;
  @Input() deleteFv: (langKey: string) => void;
  @Input() storeDataPath?: string;

  public descriptions$: Observable<ILocalizedItem<ITextualDescription>>;
  public languageKeys$: Observable<string[]>;
  public selectableLanguages$: Observable<{ label: string; value: string }[]>;
  public existingLangKeys: string[] = [];
  public langs = DESCRIPTION_LANGUAGES;
  public selectedLanguage;

  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private _store: Store<State>, private _changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.languageKeys$ = this._store
      .select(this.descriptionSelector)
      .takeUntil(this._destroy$)
      .map(desc => Object.keys(desc));
  }

  ngAfterViewInit() {
    this._changeDetectorRef.detectChanges();

    this.selectableLanguages$ = this.languageKeys$.takeUntil(this._destroy$).map(usedKeys =>
      DESCRIPTION_LANGUAGES.filter(lang => usedKeys.indexOf(lang.locale) === -1).map(lang => {
        return { label: lang.name, value: lang.locale };
      })
    );
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  getLanguageFormDescriptor(languageKey: string) {
    return {
      submit: {
        translatableLabel: 'form.submit',
        classList: ['btn', 'btn-sm', 'btn-fill', 'btn-success'],
        submitFv: (formGroup: FormGroup) => this.submitFv(languageKey, formGroup.value)
      },
      fields: {
        title: new TextboxField({
          label: 'form.title',
          required: true
        }),
        summary: new TextareaField({
          label: 'form.summary',
          required: false,
          rows: 2
        }),
        fullDescription: new EmojiField({ label: 'form.description', required: false })
      }
    };
  }

  getLanguageFormDataPath(languageKey: string) {
    return Observable.of(`${this.storeDataPath}.${languageKey}`);
  }

  public addTranslation() {
    if (this.selectedLanguage) {
      this.submitFv(this.selectedLanguage.value, { title: 'A new hike' });
    }
  }

  public deleteTranslation(lang) {
    this.deleteFv(lang);
  }

  public getLangName(key) {
    return LanguageService.localeToName(key);
  }
}
