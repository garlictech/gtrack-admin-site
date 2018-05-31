import { Action } from '@ngrx/store';
import { IPoi, IHikeProgramStored, EObjectState } from 'subrepos/provider-client';

export enum HikeProgramActionTypes {
  LOAD_HIKE_PROGRAM = '[HikeProgram] Load hikeProgram',
  LOAD_HIKE_PROGRAM_FAILED = '[HikeProgram] Load hikeProgram failed',
  HIKE_PROGRAM_LOADED = '[HikeProgram] HikeProgram loaded',
  LOAD_HIKE_PROGRAMS = '[HikeProgram] Load hikePrograms',
  ALL_HIKE_PROGRAMS_LOADED = '[HikeProgram] All hikePrograms loaded',
  UPDATE_HIKE_PROGRAM_STATE = '[HikeProgram] Update hikeProgram state',
  DELETE_HIKE_PROGRAM = '[HikeProgram] Delete hikeProgram',
  HIKE_PROGRAM_DELETED = '[HikeProgram] HikeProgram deleted'
}

export class LoadHikeProgram implements Action {
  readonly type = HikeProgramActionTypes.LOAD_HIKE_PROGRAM;

  constructor(public context: string) {}
}

export class LoadHikeProgramFailed implements Action {
  readonly type = HikeProgramActionTypes.LOAD_HIKE_PROGRAM_FAILED;

  constructor(public context: string) {}
}

export class HikeProgramLoaded implements Action {
  readonly type = HikeProgramActionTypes.HIKE_PROGRAM_LOADED;

  constructor(public context: string, public hikeProgram: IHikeProgramStored) {}
}

export class LoadHikePrograms implements Action {
  readonly type = HikeProgramActionTypes.LOAD_HIKE_PROGRAMS;
}

export class AllHikeProgramsLoaded implements Action {
  readonly type = HikeProgramActionTypes.ALL_HIKE_PROGRAMS_LOADED;

  constructor(public contexts: string[], public hikePrograms: IHikeProgramStored[]) {}
}

export class UpdateHikeProgramState implements Action {
  readonly type = HikeProgramActionTypes.UPDATE_HIKE_PROGRAM_STATE;

  constructor(public id: string, public state: EObjectState) {}
}

export class DeleteHikeProgram implements Action {
  readonly type = HikeProgramActionTypes.DELETE_HIKE_PROGRAM;

  constructor(public id: string) {}
}

export class HikeProgramDeleted implements Action {
  readonly type = HikeProgramActionTypes.HIKE_PROGRAM_DELETED;

  constructor(public context: string) {}
}

export type AllHikeActions =
  | LoadHikeProgram
  | HikeProgramLoaded
  | LoadHikeProgramFailed
  | LoadHikePrograms
  | AllHikeProgramsLoaded
  | UpdateHikeProgramState
  | DeleteHikeProgram
  | HikeProgramDeleted;
