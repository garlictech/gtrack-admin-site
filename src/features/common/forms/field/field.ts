import { ValidatorFn, Validators } from '@angular/forms';
import { Selector } from '@ngrx/store';
import { Observable, of } from 'rxjs';

export interface FieldBase {
  disableLabel?: boolean;
  disabled?: boolean;
  label?: string;
  labelParams?: object;
  key?: string;
  infoText?: string;
  required?: boolean;
  remoteErrorStateFilter?: Array<string>;
  validators?: Array<ValidatorFn>;
  controlType?: string;
  helpText?: string;
  title?: string;
  subTitle?: string;
  hidden?: boolean;
  hidden$?: Observable<boolean>;
  submitOnChange?: boolean;
  placeholder?: string;
  remoteErrorStateSelector?: Selector<any, string>;
  containerCls?: string | Array<string>;
  inputCls?: string | Array<string>;
  labelCls?: string | Array<string>;
}

export interface FieldOptions<T> extends FieldBase {
  defaultValue?: T;
  formDataSelector?: Selector<any, T>;
}

export class Field<T> implements FieldOptions<T> {
  disableLabel?: boolean;
  disabled?: boolean;
  label?: string;
  labelParams?: object;
  key?: string;
  controlType?: string;
  validators?: Array<ValidatorFn>;
  remoteErrorStateSelector?: Selector<any, string>;
  formDataSelector?: Selector<any, T>;
  remoteErrorStateFilter: Array<string>;
  defaultValue?: T;
  helpText?: string;
  title?: string;
  subTitle?: string;
  hidden?: boolean;
  hidden$: Observable<boolean>;
  required?: boolean;
  submitOnChange?: boolean;
  placeholder?: string;
  containerCls: string | Array<string>;
  inputCls: string | Array<string>;
  labelCls: string | Array<string>;

  constructor(options: FieldOptions<T>) {
    this.label = options.label || String('');
    this.validators = options.validators || [];
    this.remoteErrorStateSelector = options.remoteErrorStateSelector;
    this.formDataSelector = options.formDataSelector;
    this.remoteErrorStateFilter = options.remoteErrorStateFilter || [];
    this.key = options.key;
    this.defaultValue = options.defaultValue;
    this.helpText = options.helpText;
    this.title = options.title;
    this.subTitle = options.subTitle;
    this.hidden = options.hidden || false;
    this.hidden$ = options.hidden$ || of(false);
    this.required = !!options.required;
    this.submitOnChange = !!options.submitOnChange;
    this.disableLabel = !!options.disableLabel;
    this.labelParams = options.labelParams;
    this.placeholder = options.placeholder;
    this.disabled = options.disabled;
    this.containerCls = options.containerCls || '';
    this.inputCls = options.inputCls || '';
    this.labelCls = options.labelCls || '';

    if (!!options.required) {
      this.validators.unshift(Validators.required);
    }
  }
}
