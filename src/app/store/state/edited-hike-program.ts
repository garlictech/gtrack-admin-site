import { HikeProgramStored } from '@bit/garlictech.angular-features.common.gtrack-interfaces';

import { GenericEditedState } from './generic';

export interface EditedHikeProgramState extends GenericEditedState {
  data: HikeProgramStored;
}
