import { EAuthRoles } from './roles';

export interface ErrorResponse {
  errorMsg: string;
  data?: any;
}

export interface ProviderInput {
  userId: string;
  role: EAuthRoles;
}

export const formErrorLabels = ['invalid', 'required', 'minlength', 'maxlength', 'alreadyExists'];

export enum EBoolean {
  true = 'true',
  false = 'false'
}
