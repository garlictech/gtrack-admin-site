import { Action } from '@ngrx/store';
import { HikeProgram } from '../../services/hike-program';
import { IPoi, IHikeProgram, IHikeProgramStored } from 'subrepos/provider-client';

export enum HikeProgramActionTypes {
  LOAD_HIKE_PROGRAM = '[HikeProgram] Load hikeProgram',
  LOAD_HIKE_PROGRAM_FAILED = '[HikeProgram] Load hikeProgram failed',
  HIKE_PROGRAM_LOADED = '[HikeProgram] HikeProgram loaded',
  LOAD_HIKE_PROGRAMS = '[HikeProgram] Load hikePrograms',
  ALL_HIKE_PROGRAMS_LOADED = '[HikeProgram] All hikePrograms loaded',
  CREATE_HIKE_PROGRAM = '[HikeProgram] Create hikeProgram',
  HIKE_PROGRAM_CREATED = '[HikeProgram] HikeProgram created'
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

  constructor(public context: string, public hikeProgram: HikeProgram) {
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

  constructor(public contexts: string[], public hikePrograms: HikeProgram[]) {
    // Empty
  }
}

export class CreateHikeProgram implements Action {
  readonly type = HikeProgramActionTypes.CREATE_HIKE_PROGRAM;

  constructor(public hikeProgram: IHikeProgram) {}
}

export class HikeProgramCreated implements Action {
  readonly type = HikeProgramActionTypes.HIKE_PROGRAM_CREATED;

  constructor(public context: string) {}
}

export type AllHikeActions =
  | LoadHikeProgram
  | HikeProgramLoaded
  | LoadHikeProgramFailed
  | LoadHikePrograms
  | AllHikeProgramsLoaded
  | CreateHikeProgram
  | HikeProgramCreated;
