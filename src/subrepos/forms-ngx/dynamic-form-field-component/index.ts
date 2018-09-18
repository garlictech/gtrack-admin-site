import { map, filter } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, Observable } from 'rxjs';

import _get from 'lodash-es/get';
import _keys from 'lodash-es/keys';

import { Field } from '../field';

@Component({
  selector: 'app-form-field',
  template: ''
})
export class DynamicFormFieldComponent implements OnInit {
  @Input()
  form: FormGroup;

  @Input()
  field: Field<any>;
  @Input()
  submit: () => void;

  public remoteError$: Observable<string> = EMPTY;

  constructor(private _translate: TranslateService, private _store: Store<any>) {}

  ngOnInit() {
    if (this.field.remoteErrorStatePath) {
      const path = <string>_get(this.field, 'remoteErrorStatePath');

<<<<<<< HEAD
      this.remoteError$ = this._store.pipe(
        select(state => _get(state, `${path}`)),
        filter(err => this.field.remoteErrorStateFilter.indexOf(err) === -1),
        map(label => (label ? this._translate.instant(`form.errors.${label}`) : null))
      );
=======
      this.remoteError$ = this._store
        .pipe(
          select(state => _.get(state, `${path}`)),
          filter(err => this.field.remoteErrorStateFilter.indexOf(err) === -1),
          map(label => (label ? this._translate.instant(`form.errors.${label}`) : null))
        );
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
    }
  }

  getOnChange() {
    return function() {
      if (this.field.submitOnChange) {
        this.submit();
      }
    }.bind(this);
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
