import { IHikeProgramStored } from 'subrepos/provider-client';
import { IGenericEditedState } from './generic';

export interface IEditedHikeProgramState extends IGenericEditedState {
  data: IHikeProgramStored;
}
