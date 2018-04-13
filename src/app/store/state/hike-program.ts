import { IHikeProgram } from 'subrepos/provider-client';
import { IGenericState } from './generic';

export interface IHikeProgramState extends IGenericState {
  data: IHikeProgram;
}
