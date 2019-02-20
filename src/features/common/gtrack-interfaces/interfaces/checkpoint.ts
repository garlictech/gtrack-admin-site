import { LocalizedItem, TextualDescription } from './common';
import { ProviderInput } from './provider';

export interface CheckpointSaveResponse {
  id: string;
}

export interface CheckpointArchiveInput extends ProviderInput {
  id: string;
}

export interface Checkpoint {
  id?: string;
  elevation: number;
  lat: number;
  lon: number;
  poiId?: string;
  stampIcon?: string;
  description: LocalizedItem<TextualDescription>;
}

export interface CheckpointInput extends Checkpoint, ProviderInput {}

export interface CheckpointStored extends Checkpoint {
  id: string;
  timestamp: number;
}
