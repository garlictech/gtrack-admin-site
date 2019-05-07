import _each from 'lodash-es/each';
import _get from 'lodash-es/get';
import { some } from 'lodash/fp';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormDescriptor } from '@bit/garlictech.angular-features.common.forms';
import * as fromGenericUiActions from '@bit/garlictech.angular-features.common.generic-ui/store/actions';
import { createSelector, select, Store } from '@ngrx/store';

import { EProfileGroup } from '../../interfaces';
import { Actions } from '../../store';
import * as SettingsSelectors from '../../store/selectors';

@Component({
  selector: 'gtrack-settings-form',
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.scss']
})
export class SettingsFormComponent implements OnDestroy, AfterViewInit, OnInit {
  @Input() fields: any;
  @Input() formGroupLabel: EProfileGroup;

  handledFormDescriptor: FormDescriptor;

  loading$: Observable<boolean>;
  saving$: Observable<boolean>;
  saveFailure$: Observable<boolean>;
  fetchFailure$: Observable<boolean>;
  fieldFailure$: Observable<boolean>;

  private readonly _componentDestroyed$: Subject<boolean>;

  constructor(private readonly _store: Store<any>, private readonly _cdr: ChangeDetectorRef) {
    this._componentDestroyed$ = new Subject();
  }

  ngOnInit(): void {
    this.handledFormDescriptor = {
      formDataSelector: createSelector(
        SettingsSelectors.selectPrivateProfileInCurrentRole,
        state => _get(state, this.formGroupLabel)
      ),
      remoteErrorStateSelector: SettingsSelectors.profileGroupSaveFailure(this.formGroupLabel),
      submit: {
        translatableLabel: this.formGroupLabel !== EProfileGroup.settings ? 'form.submit' : undefined,
        submitFv: (formGroup: FormGroup) =>
          this._store.dispatch(new Actions.SettingsSaveStart(this.formGroupLabel, formGroup.value))
      },
      titleLabel: `settings.${this.formGroupLabel}.title`,
      fields: {}
    };

    this._handleFormDescriptor(this.fields, this.handledFormDescriptor.fields);
  }

  ngAfterViewInit(): void {
    this.loading$ = this._store.pipe(select(SettingsSelectors.isFetchingProfile));
    this.saving$ = this._store.pipe(select(SettingsSelectors.profileGroupSaving(this.formGroupLabel)));
    this.fetchFailure$ = this._store.pipe(select(SettingsSelectors.profileFetchFailure));

    const saveFailureBase$ = this._store.pipe(select(SettingsSelectors.profileGroupSaveFailure(this.formGroupLabel)));

    this.fieldFailure$ = saveFailureBase$.pipe(filter(error => _get(error, 'errorMsg') === 'Invalid data'));

    this.saveFailure$ = saveFailureBase$.pipe(filter(error => _get(error, 'errorMsg') !== 'Invalid data'));

    combineLatest(this.loading$, this.saving$)
      .pipe(
        takeUntil(this._componentDestroyed$),
        map(some(Boolean))
      )
      .subscribe((working: boolean) =>
        this._store.dispatch(
          working
            ? new fromGenericUiActions.ShowProgressSpinner('form.loading')
            : new fromGenericUiActions.HideProgressSpinner()
        )
      );

    this._cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this._componentDestroyed$.next(true);
    this._componentDestroyed$.complete();
  }

  private _handleFormDescriptor(source: any, destination: any, errorPath?, actualIndex?: number): void {
    _each(source, (field: any, key) => {
      const newValue = { ...field };
      if (field.controlType === 'group' || field.controlType === 'section') {
        const index = actualIndex === undefined ? 0 : actualIndex + 1;

        const embeddedPath = `${errorPath}.${key}[0][${index}]`;
        this._handleFormDescriptor(field.embeddedForm, newValue.embeddedForm, embeddedPath, actualIndex);
      } else {
        newValue.label = `settings.${this.formGroupLabel}.${key}`;

        ['title', 'subTitle', 'helpText', 'infoText'].forEach(label => {
          if (field[label]) {
            newValue[label] = `settings.${this.formGroupLabel}.${field[label]}`;
          }
        });
      }

      destination[key] = newValue;
    });
  }
}
