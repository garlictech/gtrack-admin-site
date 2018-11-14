import { Field, IFieldBase } from './field';
import { FormGroup } from '@angular/forms';
import { IFormInstance } from '../field-control-service';
import { Selector } from '@ngrx/store';
export { Field, IFieldBase };

export { EmailField } from './email';
export * from './select';
export * from './textarea';
export * from './textbox';
export * from './date-picker';
export * from './time-picker';
export * from './multi-select';
export * from './group';
export * from './section';
export * from './switch';
export * from './checkbox';
export * from './html';
export * from './text';
export * from './password';
export * from './template';
export * from './phone-number';
export * from './emoji';
export * from './slider';
export * from './range-slider';
export * from './file';
export * from './markdown';
export * from './rich-text-editor';
// export * from './file-s3';

export type IResetFv = (formDescriptor: IFormDescriptor) => IFormInstance;

export type ISubmitFv = (formGroup: FormGroup) => void;

export interface ISubmit {
  translatableLabel?: string;
  classList?: Array<string>;
  submitFv: ISubmitFv;
  resetFv?: IResetFv;
  resetOnSubmit?: boolean;
}

export interface IFormDescriptor<T = any> {
  fields: any;
  submit: ISubmit;
  formDataSelector?: Selector<any, T>;
  remoteErrorStateSelector?: Selector<any, any>;
  titleLabel?: string;
}
