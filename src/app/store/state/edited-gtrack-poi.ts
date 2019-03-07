import { PoiStored } from '@bit/garlictech.angular-features.common.gtrack-interfaces';

import { GenericEditedState } from './generic';

export interface EditedGTrackPoiState extends GenericEditedState {
  data: PoiStored;
}
