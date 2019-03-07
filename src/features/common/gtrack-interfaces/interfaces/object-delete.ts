import { ProviderInput } from './provider';

export interface ObjectDeleteInput extends ProviderInput {
  id: string;
  table: string;
}
