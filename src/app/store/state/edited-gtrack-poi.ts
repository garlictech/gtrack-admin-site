import { IPoiStored } from 'subrepos/provider-client';

import { GenericEditedState } from './generic';

export interface EditedGTrackPoiState extends GenericEditedState {
  data: IPoiStored;
}
