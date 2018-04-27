import { IProviderInput } from './provider';
import { ILocalizedItem, ITextualDescription } from './common';

export interface ICheckpointSaveResponse {
  id: string;
}

export interface ICheckpointArchiveInput extends IProviderInput {
  id: string;
}

export interface ICheckpoint {
  id?: string;
  elevation: number;
  lat: number;
  lon: number;
  poiId?: string;
  stampIcon?: string;
  description: ILocalizedItem<ITextualDescription>;
}

export interface ICheckpointInput extends ICheckpoint, IProviderInput {};

export interface ICheckpointStored extends ICheckpoint {
  id: string;
  timestamp: number;
}
