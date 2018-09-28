import { IProviderInput } from './provider';

export enum EObjectState {
  draft = 'draft',
  published = 'published',
  archived = 'archived'
}

export interface IPublishable {
  state: EObjectState;
  published?: number;
}

export interface IStateChangeInput extends IProviderInput {
  id: string;
  table: string;
  state: EObjectState;
}
