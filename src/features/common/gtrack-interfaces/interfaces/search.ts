import { ProviderInput } from './provider';

export interface SearchSerializerInput extends ProviderInput {
  payload: {
    table: string;
    query: Array<any>;
    limit?: number;
  };
}
