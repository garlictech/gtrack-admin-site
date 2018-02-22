import { EAuthRoles } from './roles';

export interface IErrorResponse {
  errorMsg: string;
  data?: any;
}

export interface IProviderInput {
  userId: string;
  role: EAuthRoles;
}

export const formErrorLabels = ['invalid', 'required', 'minlength', 'maxlength', 'alreadyExists'];

export enum EBoolean {
  true = 'true',
  false = 'false'
}
