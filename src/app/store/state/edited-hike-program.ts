import { IHikeProgram } from 'subrepos/provider-client';
import { IGenericState } from './generic';

export interface IEditedHikeProgramState extends IGenericState {
  data: IHikeProgram;
}
