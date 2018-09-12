import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import * as _ from 'lodash';

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

  public remoteError$: Observable<string> = Observable.empty();

  constructor(private _translate: TranslateService, private _store: Store<any>) {
    /* EMPTY */
  }

  ngOnInit() {
    if (this.field.remoteErrorStatePath) {
      const path = <string>_.get(this.field, 'remoteErrorStatePath');

      this.remoteError$ = this._store
        .select(state => _.get(state, `${path}`))
        .filter(err => this.field.remoteErrorStateFilter.indexOf(err) === -1)
        .map(label => (label ? this._translate.instant(`form.errors.${label}`) : null));
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
    return _.get(this.field, 'placeholder', '');
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
    const errorKey = _.keys(fieldObj.errors)[0];
    return errorKey ? this._translate.instant(`form.errors.${errorKey}`) : null;
  }

  private _fieldObj(): any {
    return _.get(this.form, `controls[${this.field.key}]`);
  }
}
