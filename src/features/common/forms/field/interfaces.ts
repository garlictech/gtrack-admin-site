import { FormGroup } from '@angular/forms';
import { Selector } from '@ngrx/store';
import { FormInstance } from '../field-control/field-control.service';

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
