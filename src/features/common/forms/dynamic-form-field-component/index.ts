import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DestroyableComponent } from '@bit/garlictech.angular-features.common.utils';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import _get from 'lodash-es/get';
import _keys from 'lodash-es/keys';
import { EMPTY, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, pluck, takeUntil } from 'rxjs/operators';
import { Field, FormDescriptor } from '../field';
import { FieldOptions } from '../field/field';

@Component({
  selector: 'app-form-field',
  template: ''
})
export class DynamicFormFieldComponent extends DestroyableComponent implements OnInit, OnDestroy {
  @Input() form: FormGroup;

  @Input() field: Field<any>;

  @Input() formDescriptor: FormDescriptor;

  // tslint:disable-next-line:no-output-named-after-standard-event
  @Output() readonly submit: EventEmitter<any>;

  remoteError$: Observable<string>;

  protected _change$;

  constructor(private readonly _translate: TranslateService, private readonly _store: Store<any>) {
    super();
    this.submit = new EventEmitter<any>();
    this.remoteError$ = EMPTY;
    this._change$ = new Subject<any>();
  }

  ngOnInit(): void {
    this._change$
      .pipe(
        takeUntil(this._destroy$),
        distinctUntilChanged(),
        debounceTime(500)
      )
      .subscribe(() => this._handleChange());

    if (this.field.remoteErrorStateSelector) {
      this.remoteError$ = this._store.pipe(
        select(this.field.remoteErrorStateSelector),
        filter(err => this.field.remoteErrorStateFilter.indexOf(err) === -1),
        map(label => (label ? this._translate.instant(`form.errors.${label}`) : undefined))
      );
    } else if (this.formDescriptor && this.formDescriptor.remoteErrorStateSelector) {
      this.remoteError$ = this._store.pipe(
        select(this.formDescriptor.remoteErrorStateSelector),
        filter(error => !!error),
        pluck(this.field.key),
        filter((err: string) => this.field.remoteErrorStateFilter.indexOf(err) === -1),
        map(label => (label ? this._translate.instant(`form.errors.${label}`) : undefined))
      );
    }

    if (this.field.formDataSelector) {
      this._store
        .pipe(
          select(this.field.formDataSelector),
          takeUntil(this._destroy$),
          filter(fieldData => !!fieldData)
        )
        .subscribe(fieldData => {
          const val: object = {};
          val[this.field.key] = fieldData;
          this.form.patchValue(val);
        });
    }
  }

  ngOnDestroy(): void {
    this._destroy();
  }

  onChange(data: any): void {
    this._change$.next(data);
  }

  getOnChange(): any {
    return (): void => {
      if ((this.field as FieldOptions<any>).submitOnChange) {
        this.formDescriptor.submit.submitFv(this.form);
      }
    };
  }

  get labelParams(): any {
    return this.field.labelParams || {};
  }

  get sanitizedPlaceholder(): any {
    return _get(this.field, 'placeholder', '');
  }

  get containerClasses(): any {
    const list = ['form-group'];

    if (this.field.controlType === 'switch') {
      list.push('switch-group');
    }

    return list;
  }

  get showError(): boolean {
    const fieldObj = this._fieldObj();

    if (!!fieldObj) {
      return fieldObj.invalid && (fieldObj.dirty || fieldObj.touched);
    } else {
      return false;
    }
  }

  get showRemoteError(): boolean {
    const fieldObj = this._fieldObj();

    if (!!fieldObj) {
      return !(fieldObj.touched || fieldObj.dirty);
    } else {
      return false;
    }
  }

  get actualError(): void {
    const fieldObj = this._fieldObj();
    const errorKey = _keys(fieldObj.errors)[0];

    return errorKey ? this._translate.instant(`form.errors.${errorKey}`) : undefined;
  }

  protected _handleChange(): void {
    if (this.field.submitOnChange) {
      this.submit.emit();
    }
  }

  private _fieldObj(): any {
    return _get(this.form, `controls[${this.field.key}]`);
  }
}
