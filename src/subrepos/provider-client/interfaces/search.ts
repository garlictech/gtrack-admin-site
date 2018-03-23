import { IProviderInput } from './provider';

export interface ISearchSerializerInput extends IProviderInput {
  payload: {
    table: string;
    query: any[];
    limit?: number;
  };
}
