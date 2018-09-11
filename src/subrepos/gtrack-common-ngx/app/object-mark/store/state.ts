import { EObjectMarkContext } from 'subrepos/provider-client';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

export interface IObjectMarkData {
  id: EObjectMarkContext;
  markedObjects: any[];
}

export const objectMarkAdapter = createEntityAdapter<IObjectMarkData>();
export interface IObjectMarkEntityState extends EntityState<IObjectMarkData> {}

export interface IObjectMarkContext {
  id: EObjectMarkContext;
  loading: boolean;
  loaded: boolean;
  saving: boolean;
  saved: boolean;
}

export interface IObjectMarkContextState extends EntityState<IObjectMarkContext> {}
export const objectMarkContextAdapter = createEntityAdapter<IObjectMarkContext>();

export interface IObjectMarkState {
  objectMarks: IObjectMarkEntityState;
  contexts: IObjectMarkContextState;
}
