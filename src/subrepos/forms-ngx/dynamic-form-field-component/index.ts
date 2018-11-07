import { map, filter } from 'rxjs/operators';
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import _get from 'lodash-es/get';
import _keys from 'lodash-es/keys';

import { Field } from '../field';

@Component({
  selector: 'app-form-field',
  template: ''
})
export class DynamicFormFieldComponent implements OnInit, OnDestroy {
  @Input()
  form: FormGroup;

  @Input()
  field: Field<any>;

  @Output()
  submit = new EventEmitter<any>();

  public remoteError$: Observable<string> = EMPTY;

  private _change$ = new Subject<any>();
  private _destroy$ = new Subject<boolean>();

  constructor(private _translate: TranslateService, private _store: Store<any>) {
    this
      ._change$
      .pipe(
        takeUntil(this._destroy$),
        distinctUntilChanged(),
        debounceTime(500)
      )
      .subscribe(() => this._handleChange());
  }

  ngOnInit() {
    if (this.field.remoteErrorStatePath) {
      const path = <string>_get(this.field, 'remoteErrorStatePath');

      this.remoteError$ = this._store.pipe(
        select(state => _get(state, `${path}`)),
        filter(err => this.field.remoteErrorStateFilter.indexOf(err) === -1),
        map(label => (label ? this._translate.instant(`form.errors.${label}`) : null))
      );
    }
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  protected _handleChange() {
    if (this.field.submitOnChange) {
      this.submit.emit();
    }
  }

  onChange(data: any) {
    this._change$.next(data);
  }

  get labelParams() {
    if (this.field.labelParams) {
      return this.field.labelParams;
    }

    return {};
  }

  get sanitizedPlaceholder() {
    return _get(this.field, 'placeholder', '');
  }

  get containerClasses() {
    const list = ['form-group'];

    if (this.field.controlType === 'switch') {
      list.push('switch-group');
    }

    return list;
  }

  get showError() {
    const fieldObj = this._fieldObj();

    if (!!fieldObj) {
      return fieldObj.invalid && (fieldObj.dirty || fieldObj.touched);
    } else {
      return false;
    }
  }

  get showRemoteError() {
    const fieldObj = this._fieldObj();

    if (!!fieldObj) {
      return !(fieldObj.touched || fieldObj.dirty);
    } else {
      return false;
    }
  }

  get actualError() {
    const fieldObj = this._fieldObj();
    const errorKey = _keys(fieldObj.errors)[0];
    return errorKey ? this._translate.instant(`form.errors.${errorKey}`) : null;
  }

  private _fieldObj(): any {
    return _get(this.form, `controls[${this.field.key}]`);
  }
}
