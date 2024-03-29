// tslint:disable:no-property-initializers max-classes-per-file
import { EObjectState, HikeProgramStored } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { Action } from '@ngrx/store';

export enum HikeProgramActionTypes {
  LOAD_HIKE_PROGRAM = '[HikeProgram] Load hikeProgram',
  LOAD_HIKE_PROGRAM_FAILED = '[HikeProgram] Load hikeProgram failed',
  HIKE_PROGRAM_LOADED = '[HikeProgram] HikeProgram loaded',
  LOAD_HIKE_PROGRAMS = '[HikeProgram] Load hikePrograms',
  ALL_HIKE_PROGRAMS_LOADED = '[HikeProgram] All hikePrograms loaded',
  UPDATE_HIKE_PROGRAM_STATE = '[HikeProgram] Update hike program state',
  DELETE_HIKE_PROGRAM = '[HikeProgram] Delete hikeProgram',
  HIKE_PROGRAM_DELETED = '[HikeProgram] HikeProgram deleted',
  REVERSE_HIKE_PROGRAM = '[HikeProgram] Reverse HikeProgram',
  HIKE_PROGRAM_REVERSED = '[HikeProgram] HikeProgram Reversed'
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

  constructor(public context: string, public hikeProgram: HikeProgramStored) {}
}

export class LoadHikePrograms implements Action {
  readonly type = HikeProgramActionTypes.LOAD_HIKE_PROGRAMS;
}

export class AllHikeProgramsLoaded implements Action {
  readonly type = HikeProgramActionTypes.ALL_HIKE_PROGRAMS_LOADED;

  constructor(public contexts: Array<string>, public hikePrograms: Array<HikeProgramStored>) {}
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

export class ReverseHikeProgram implements Action {
  readonly type = HikeProgramActionTypes.REVERSE_HIKE_PROGRAM;

  constructor(public context: string) {}
}

export class HikeProgramReversed implements Action {
  readonly type = HikeProgramActionTypes.HIKE_PROGRAM_REVERSED;

  constructor(public context: string, public hikeProgram: HikeProgramStored) {}
}

export type AllHikeActions =
  | LoadHikeProgram
  | HikeProgramLoaded
  | LoadHikeProgramFailed
  | LoadHikePrograms
  | AllHikeProgramsLoaded
  | UpdateHikeProgramState
  | DeleteHikeProgram
  | HikeProgramDeleted
  | ReverseHikeProgram
  | HikeProgramReversed;
