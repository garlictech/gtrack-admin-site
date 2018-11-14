import { ValidatorFn, Validators } from '@angular/forms';
import { of, Observable } from 'rxjs';
import { Selector } from '@ngrx/store';

export interface IFieldBase {
  disableLabel?: boolean;
  disabled?: boolean;
  label?: string;
  labelParams?: object;
  key?: string;
  infoText?: string;
  required?: boolean;
  remoteErrorStateFilter?: string[];
  validators?: ValidatorFn[];
  controlType?: string;
  helpText?: string;
  title?: string;
  subTitle?: string;
  hidden?: boolean;
  hidden$?: Observable<boolean>;
  submitOnChange?: boolean;
  placeholder?: string;
  remoteErrorStateSelector?: Selector<any, string>;
}

export interface IField<T> extends IFieldBase {
  defaultValue?: T;
  formDataSelector?: Selector<any, T>;
}

export class Field<T> implements IField<T> {
  disableLabel?: boolean;
  disabled?: boolean;
  label?: string;
  labelParams?: object;
  key?: string;
  controlType?: string;
  validators?: ValidatorFn[];
  remoteErrorStateSelector?: Selector<any, string>;
  formDataSelector?: Selector<any, T>;
  remoteErrorStateFilter: string[];
  defaultValue?: T;
  helpText?: string;
  title?: string;
  subTitle?: string;
  hidden?: boolean;
  hidden$: Observable<boolean>;
  required?: boolean;
  submitOnChange?: boolean;
  placeholder?: string;

  constructor(options: IField<T>) {
    this.label = options.label || '';
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

    if (!!options.required) {
      this.validators.unshift(Validators.required);
    }
  }
}
