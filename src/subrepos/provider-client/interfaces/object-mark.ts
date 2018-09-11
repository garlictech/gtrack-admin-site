import { IProviderInput } from './provider';

export enum EObjectMarkContext {
  bookmarkedHike = 'bookmarkedHike',
  bannedUser = 'bannedUser'
}

export interface IObjectMark {
  mark: boolean;
  context: EObjectMarkContext;
  object: any;
}

export interface IObjectMarkInput extends IProviderInput, IObjectMark {}
