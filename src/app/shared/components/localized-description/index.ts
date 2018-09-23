import {
  Component,
  Input,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subject, of} from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';

import { ITextualDescription, ILocalizedItem } from 'subrepos/provider-client';
import { TextboxField, MarkdownField } from 'subrepos/gtrack-common-web/forms';

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
  @Input() submitFv: (langKey: string, data) => void;
  @Input() deleteFv: (langKey: string) => void;
  @Input() storeDataPath?: string;
  @Input() type?: string;

  public descriptions$: Observable<ILocalizedItem<ITextualDescription>>;
  public languageKeys$: Observable<string[]>;
  public selectableLanguages$: Observable<{ label: string; value: string }[]>;
  public existingLangKeys: string[] = [];
  public langs = DESCRIPTION_LANGUAGES;
  public selectedLanguage;
  public languageFormDescriptors: ILanguageKeyObject = {};
  public languageFormDataPaths: ILanguageKeyObject = {};
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private _store: Store<State>, private _changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.languageKeys$ = this._store
      .pipe(
        select(this.descriptionSelector),
        takeUntil(this._destroy$),
        map(desc => {
          const langKeys = Object.keys(desc || {});

          this.languageFormDescriptors = {};
          this.languageFormDataPaths = {};

          for (const key of langKeys) {
            this.languageFormDescriptors[key] = this._getLanguageFormDescriptor(key);
            this.languageFormDataPaths[key] = this._getLanguageFormDataPath(key);
          }

          return langKeys;
        })
      );
  }

  ngAfterViewInit() {
    this.selectableLanguages$ = this.languageKeys$.pipe(
      takeUntil(this._destroy$),
      map(usedKeys =>
        DESCRIPTION_LANGUAGES
          .filter(lang => usedKeys.indexOf(lang.locale) === -1).map(lang => {
            return { label: lang.name, value: lang.locale };
          })
      )
    );

    this._changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  private _getLanguageFormDescriptor(languageKey: string) {
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
        summary: new MarkdownField({
          label: 'form.summary',
          required: false,
          rows: 2
        }),
        fullDescription: new MarkdownField({
          label: 'form.description',
          required: false
        })
      }
    };
  }

  private _getLanguageFormDataPath(languageKey: string) {
    return of(`${this.storeDataPath}.${languageKey}`);
  }

  public addTranslation() {
    if (this.selectedLanguage) {
      this.submitFv(this.selectedLanguage.value, {
        title: `A new ${this.type}`,
        fullDescription: '',
        summary: ''
      });
    }
  }

  public deleteTranslation(lang) {
    this.deleteFv(lang);
  }

  public getLangName(key) {
    return LanguageService.localeToName(key);
  }
}
