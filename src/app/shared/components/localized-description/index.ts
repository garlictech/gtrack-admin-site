import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { MarkdownField, TextboxField } from 'subrepos/gtrack-common-web/forms';
import { ILocalizedItem, ITextualDescription } from 'subrepos/provider-client';

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';

import { State } from '../../../store';
import { DESCRIPTION_LANGUAGES, LanguageService } from '../../services';

interface ILanguageKeyObject {
  [key: string]: any;
}

@Component({
  selector: 'app-localized-description',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalizedDescriptionComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input() descriptionSelector: any;
  @Input() descriptionLangSelector: any;
  @Input() submitFv: (langKey: string, data) => void;
  @Input() deleteFv: (langKey: string) => void;
  @Input() type?: string;

  descriptions$: Observable<ILocalizedItem<ITextualDescription>>;
  languageKeys$: Observable<Array<string>>;
  selectableLanguages$: Observable<Array<{ label: string; value: string }>>;
  existingLangKeys: Array<string> = [];
  langs = DESCRIPTION_LANGUAGES;
  selectedLanguage;
  languageFormDescriptors: ILanguageKeyObject = {};
  private readonly _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private readonly _store: Store<State>, private readonly _changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.languageKeys$ = this._store.pipe(
      select(this.descriptionSelector),
      takeUntil(this._destroy$),
      map(desc => {
        const langKeys = Object.keys(desc || {});

        this.languageFormDescriptors = {};

        for (const key of langKeys) {
          this.languageFormDescriptors[key] = this._getLanguageFormDescriptor(key);
        }

        return langKeys;
      })
    );
  }

  ngAfterViewInit() {
    this.selectableLanguages$ = this.languageKeys$.pipe(
      takeUntil(this._destroy$),
      map(usedKeys =>
        DESCRIPTION_LANGUAGES.filter(lang => usedKeys.indexOf(lang.locale) === -1).map(lang => ({
          label: lang.name,
          value: lang.locale
        }))
      )
    );

    this._changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  addTranslation() {
    if (this.selectedLanguage) {
      this.submitFv(this.selectedLanguage.value, {
        title: `A new ${this.type}`,
        fullDescription: '',
        summary: ''
      });

      this.selectedLanguage = null;
    }
  }

  deleteTranslation(lang) {
    this.deleteFv(lang);
  }

  getLangName(key) {
    return LanguageService.localeToName(key);
  }

  trackByFn(index: number): number {
    return index;
  }

  private _getLanguageFormDescriptor(languageKey: string) {
    return {
      formDataSelector: this.descriptionLangSelector(languageKey),
      submit: {
        translatableLabel: 'form.submit',
        classList: ['btn', 'btn-sm', 'btn-fill', 'btn-success'],
        submitFv: (formGroup: FormGroup) => this.submitFv(languageKey, formGroup.value)
      },
      fields: {
        title: new TextboxField({
          label: 'form.title',
          required: true,
          submitOnChange: true
        }),
        summary: new MarkdownField({
          label: 'form.summary',
          required: false,
          rows: 2,
          submitOnChange: true
        }),
        fullDescription: new MarkdownField({
          label: 'form.description',
          required: false,
          submitOnChange: true
        })
      }
    };
  }
}
