import { IPoiStored } from 'subrepos/provider-client';
import { IGenericEditedState } from './generic';

export interface IEditedGtrackPoiState extends IGenericEditedState {
  data: IPoiStored;
}
