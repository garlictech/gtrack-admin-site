import { ProviderInput } from './provider';

export enum EObjectState {
  draft = 'draft',
  published = 'published',
  archived = 'archived'
}

export interface Publishable {
  state: EObjectState;
  published?: number;
}

export interface StateChangeInput extends ProviderInput {
  id: string;
  table: string;
  state: EObjectState;
}
