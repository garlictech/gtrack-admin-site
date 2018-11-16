import * as fromGenericUiActions from '@common.features/generic-ui/store/actions';
import _each from 'lodash-es/each';
import _get from 'lodash-es/get';
import { Actions, Selectors } from '../store';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { combineLatest } from 'rxjs';
import { createSelector, select, Store } from '@ngrx/store';
import { EProfileGroup } from '../interfaces';
import { filter, map, takeUntil } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { IFormDescriptor } from 'subrepos/forms-ngx';
import { Observable, Subject } from 'rxjs';
import { some } from 'lodash/fp';
import { State } from 'app/store';

@Component({
  selector: 'gtrack-settings-form',
  templateUrl: './ui.pug',
  styleUrls: ['./style.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SettingsFormComponent implements OnDestroy, AfterViewInit, OnInit {
  @Input()
  public fields: any;
  @Input()
  public formGroupLabel: EProfileGroup;

  public handledFormDescriptor: IFormDescriptor;

  public loading$: Observable<boolean>;
  public saving$: Observable<boolean>;
  public saveFailure$: Observable<boolean>;
  public fetchFailure$: Observable<boolean>;
  public fieldFailure$: Observable<boolean>;

  private _componentDestroyed$: Subject<boolean> = new Subject();

  constructor(private _store: Store<State>, private _cdr: ChangeDetectorRef) {
    /* EMPTY */
  }

  ngOnInit() {
    this.handledFormDescriptor = {
      formDataSelector: createSelector(Selectors.selectPrivateProfileInCurrentRole, state =>
        _get(state, this.formGroupLabel)
      ),
      remoteErrorStateSelector: Selectors.profileGroupSaveFailure(this.formGroupLabel),
      submit: {
        translatableLabel:
          this.formGroupLabel !== EProfileGroup.settings ? 'form.submit' : undefined,
        submitFv: (formGroup: FormGroup) =>
          this._store.dispatch(new Actions.SettingsSaveStart(this.formGroupLabel, formGroup.value))
      },
      titleLabel: `settings.${this.formGroupLabel}.title`,
      fields: {}
    };

    this._handleFormDescriptor(this.fields, this.handledFormDescriptor.fields);
  }

  ngAfterViewInit() {
    this.loading$ = this._store.pipe(select(Selectors.isFetchingProfile));
    this.saving$ = this._store.pipe(select(Selectors.profileGroupSaving(this.formGroupLabel)));
    this.fetchFailure$ = this._store.pipe(select(Selectors.profileFetchFailure));

    const saveFailureBase$ = this._store.pipe(
      select(Selectors.profileGroupSaveFailure(this.formGroupLabel))
    );

    this.fieldFailure$ = saveFailureBase$.pipe(
      filter(error => _get(error, 'errorMsg') === 'Invalid data')
    );

    this.saveFailure$ = saveFailureBase$.pipe(
      filter(error => _get(error, 'errorMsg') !== 'Invalid data')
    );

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

  ngOnDestroy() {
    this._componentDestroyed$.next(true);
    this._componentDestroyed$.complete();
  }

  private _handleFormDescriptor(source: any, destination: any, errorPath?, actualIndex?) {
    _each(source, (field: any, key) => {
      const newValue = { ...field };
      if (field.controlType === 'group' || field.controlType === 'section') {
        const index = actualIndex === undefined ? 0 : actualIndex + 1;

        const embeddedPath = `${errorPath}.${key}[0][${index}]`;
        this._handleFormDescriptor(
          field.embeddedForm,
          newValue.embeddedForm,
          embeddedPath,
          actualIndex
        );
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
