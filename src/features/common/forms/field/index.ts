import { FormGroup } from '@angular/forms';
import { Selector } from '@ngrx/store';
import { FormInstance } from '../field-control-service';
import { Field, FieldBase } from './field';
export { Field, FieldBase };

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
export * from './chips';

export type ResetFv = (formDescriptor: FormDescriptor) => FormInstance;

export type SubmitFv = (formGroup: FormGroup) => void;

export interface Submit {
  translatableLabel?: string;
  classList?: Array<string>;
  submitFv: SubmitFv;
  resetFv?: ResetFv;
  resetOnSubmit?: boolean;
}

export interface FormDescriptor<T = any> {
  fields: any;
  submit: Submit;
  formDataSelector?: Selector<any, T>;
  remoteErrorStateSelector?: Selector<any, any>;
  titleLabel?: string;
}
