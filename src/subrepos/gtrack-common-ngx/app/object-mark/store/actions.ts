// tslint:disable:no-property-initializers max-classes-per-file
import { EObjectMarkContext } from '@features/common/gtrack-interfaces';
import { Action } from '@ngrx/store';

export enum ObjectMarkActionTypes {
  LOAD_CONTEXT = '[ObjectMark] Load context',
  CONTEXT_LOADED = '[ObjectMark] Context loaded',
  MARK_OBJECT = '[ObjectMark] Mark object',
  OBJECT_MARKED = '[ObjectMark] Object marked'
}

export class LoadContext implements Action {
  readonly type = ObjectMarkActionTypes.LOAD_CONTEXT;

  constructor(public context: EObjectMarkContext) {}
}

export class ContextLoaded implements Action {
  readonly type = ObjectMarkActionTypes.CONTEXT_LOADED;

  constructor(public context: EObjectMarkContext, public objects: Array<any>) {}
}

export class MarkObject implements Action {
  readonly type = ObjectMarkActionTypes.MARK_OBJECT;

  constructor(public context: EObjectMarkContext, public object: any, public mark: boolean) {}
}

export class ObjectMarked implements Action {
  readonly type = ObjectMarkActionTypes.OBJECT_MARKED;

  constructor(public context: EObjectMarkContext, public object: any, public mark: boolean) {}
}

export type AllObjectMarkActionTypes = LoadContext | ContextLoaded | MarkObject | ObjectMarked;
