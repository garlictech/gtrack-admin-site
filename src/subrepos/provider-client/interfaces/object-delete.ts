import { IProviderInput } from './provider';

export interface IObjectDeleteInput extends IProviderInput {
  id: string;
  table: string;
};
