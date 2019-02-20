import { IHikeProgramStored } from 'subrepos/provider-client';

import { GenericEditedState } from './generic';

export interface EditedHikeProgramState extends GenericEditedState {
  data: IHikeProgramStored;
}
