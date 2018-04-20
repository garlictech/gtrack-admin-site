import { IPoiStored } from 'subrepos/provider-client';
import { IGenericEditedState } from './generic';

export interface IEditedGTrackPoiState extends IGenericEditedState {
  data: IPoiStored;
}
