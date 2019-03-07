import { ProviderInput } from './provider';

export enum EObjectMarkContext {
  bookmarkedHike = 'bookmarkedHike',
  bannedUser = 'bannedUser'
}

export interface ObjectMark {
  mark: boolean;
  context: EObjectMarkContext;
  object: any;
}

export interface ObjectMarkInput extends ProviderInput, ObjectMark {}
