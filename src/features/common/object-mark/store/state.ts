import { EObjectMarkContext } from '@features/common/gtrack-interfaces';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

export interface ObjectMarkData {
  id: EObjectMarkContext;
  markedObjects: Array<any>;
}

export const objectMarkAdapter = createEntityAdapter<ObjectMarkData>();
export interface ObjectMarkEntityState extends EntityState<ObjectMarkData> {}

export interface ObjectMarkContext {
  id: EObjectMarkContext;
  loading: boolean;
  loaded: boolean;
  saving: boolean;
  saved: boolean;
}

export interface ObjectMarkContextState extends EntityState<ObjectMarkContext> {}
export const objectMarkContextAdapter = createEntityAdapter<ObjectMarkContext>();

export interface ObjectMarkState {
  objectMarks: ObjectMarkEntityState;
  contexts: ObjectMarkContextState;
}

export const featureName = 'features.common.objectMarks';
