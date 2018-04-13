import { IPoiStored } from 'subrepos/provider-client';
import { IGenericState } from './generic';

export interface IEditedGtrackPoiState extends IGenericState {
  data: IPoiStored;
}
