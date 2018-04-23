import { ValidatorFn, Validators } from '@angular/forms';

export interface IFieldBase {
  disableLabel?: boolean;
  label?: string;
  labelParams?: object;
  key?: string;
  infoText?: string;
  required?: boolean;
  remoteErrorStatePath?: string;
  validators?: ValidatorFn[];
  controlType?: string;
  helpText?: string;
  title?: string;
  subTitle?: string;
  hidden?: boolean
  submitOnChange?: boolean
}

export interface IField<T> extends IFieldBase {
  defaultValue?: T;
}

export class Field<T> implements IField<T> {
  disableLabel?: boolean;
  label?: string;
  labelParams?: object;
  key?: string;
  controlType?: string;
  validators?: ValidatorFn[];
  remoteErrorStatePath?: string;
  defaultValue?: T;
  helpText?: string;
  title?: string;
  subTitle?: string;
  hidden?: boolean;
  required?: boolean;
  submitOnChange?: boolean;

  constructor(options: IField<T>) {
    this.label = options.label || '';
    this.validators = options.validators || [];
    this.remoteErrorStatePath = options.remoteErrorStatePath;
    this.key = options.key;
    this.defaultValue = options.defaultValue;
    this.helpText = options.helpText;
    this.title = options.title;
    this.subTitle = options.subTitle;
    this.hidden = options.hidden || false;
    this.required = !!options.required;
    this.submitOnChange = !!options.submitOnChange;
    this.disableLabel = !!options.disableLabel;
    this.labelParams = options.labelParams;

    if (!!options.required) {
      this.validators.unshift(Validators.required);
    }
  }
}
