import { IProviderInput } from './provider';

export enum EObjectMarkContext {
  bookmarkedHike = 'bookmarkedHike',
  bannedUser = 'bannedUser'
}

export interface IObjectMarkInput extends IProviderInput {
  mark: boolean;
  context: EObjectMarkContext;
  objectId: string;
}
