import { IHikeProgram } from 'subrepos/provider-client';

export interface IHikeProgramState {
  data: IHikeProgram;
  dirty: boolean;
  working: string | null;
  failed: null;
}
