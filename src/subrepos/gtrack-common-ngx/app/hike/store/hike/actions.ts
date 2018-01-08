import { Action } from '@ngrx/store';
import { IHikeProgram } from '../../services/hike-program';
import { IPoi } from '../../services/poi';

export enum HikeProgramActionTypes {
  LOAD_HIKE_PROGRAM = '[HikeProgram] Load hikeProgram',
  LOAD_HIKE_PROGRAM_FAILED = '[HikeProgram] Load hikeProgram failed',
  HIKE_PROGRAM_LOADED = '[HikeProgram] HikeProgram loaded',
  LOAD_HIKE_PROGRAMS = '[HikeProgram] Load hikePrograms',
  ALL_HIKE_PROGRAMS_LOADED = '[HikeProgram] All hikePrograms loaded',
}

export class LoadHikeProgram implements Action {
  readonly type = HikeProgramActionTypes.LOAD_HIKE_PROGRAM;

  constructor(public context: string) {
    // Empty
  }
}

export class LoadHikeProgramFailed implements Action {
  readonly type = HikeProgramActionTypes.LOAD_HIKE_PROGRAM_FAILED;

  constructor(public context: string) {
    // Empty
  }
}

export class HikeProgramLoaded implements Action {
  readonly type = HikeProgramActionTypes.HIKE_PROGRAM_LOADED;

  constructor(public context: string, public hikeProgram: IHikeProgram) {
    // Empty
  }
}

export class LoadHikePrograms implements Action {
  readonly type = HikeProgramActionTypes.LOAD_HIKE_PROGRAMS;

  constructor() {
    // Empty
  }
}

export class AllHikeProgramsLoaded implements Action {
  readonly type = HikeProgramActionTypes.ALL_HIKE_PROGRAMS_LOADED;

  constructor(public contexts: string[], public hikePrograms: IHikeProgram[]) {
    // Empty
  }
}

export type AllHikeActions =
  | LoadHikeProgram
  | HikeProgramLoaded
  | LoadHikeProgramFailed
  | LoadHikePrograms
  | AllHikeProgramsLoaded;
