import { FormGroup } from '@angular/forms';
import { Field, IFieldBase } from './field';
import { IFormInstance } from '../field-control-service';
export { Field, IFieldBase };

export { EmailField } from './email';
export * from './select';
export * from './textarea';
export * from './textbox';
export * from './date-picker';
export * from './multi-select';
export * from './group';
export * from './section';
export * from './switch';
export * from './checkbox';
export * from './html';
export * from './text';
<<<<<<< HEAD
export * from './slider';
=======
export * from './password';
export * from './template';
export * from './phone-number';
export * from './emoji';
export * from './file-upload';
>>>>>>> refs/subrepo/src/subrepos/forms-ngx/fetch

export interface IResetFv {
  (formDescriptor: IFormDescriptor): IFormInstance;
}

export interface ISubmitFv {
  (formGroup: FormGroup): void;
}

export interface ISubmit {
  translatableLabel?: string;
  classList?: Array<string>;
  submitFv: ISubmitFv;
  resetFv?: IResetFv;
  resetOnSubmit?: boolean;
}

export interface IFormDescriptor {
  fields: any;
  submit: ISubmit;
  storePath?: string;
  titleLabel?: string;
}
