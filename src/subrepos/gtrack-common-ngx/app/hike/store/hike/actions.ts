import { Action } from '@ngrx/store';
import { IPoi, IHikeProgramStored } from 'subrepos/provider-client';

export enum HikeProgramActionTypes {
  LOAD_HIKE_PROGRAM = '[HikeProgram] Load hikeProgram',
  LOAD_HIKE_PROGRAM_FAILED = '[HikeProgram] Load hikeProgram failed',
  HIKE_PROGRAM_LOADED = '[HikeProgram] HikeProgram loaded',
  LOAD_HIKE_PROGRAMS = '[HikeProgram] Load hikePrograms',
<<<<<<< HEAD
  ALL_HIKE_PROGRAMS_LOADED = '[HikeProgram] All hikePrograms loaded',
  SAVE_HIKE_PROGRAM = '[HikeProgram] Save hikeProgram',
  HIKE_PROGRAM_SAVED = '[HikeProgram] HikeProgram saved',
  HIKE_PROGRAM_MODIFIED = '[HikeProgram] HikeProgram modified'
=======
  ALL_HIKE_PROGRAMS_LOADED = '[HikeProgram] All hikePrograms loaded'
>>>>>>> fix: adding multi language component
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

  constructor(public context: string, public hikeProgram: IHikeProgramStored) {
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

  constructor(public contexts: string[], public hikePrograms: IHikeProgramStored[]) {
    // Empty
  }
}

<<<<<<< HEAD
export class SaveHikeProgram implements Action {
  readonly type = HikeProgramActionTypes.SAVE_HIKE_PROGRAM;

  constructor(public hikeProgram: IHikeProgramStored) {}
}

export class HikeProgramSaved implements Action {
  readonly type = HikeProgramActionTypes.HIKE_PROGRAM_SAVED;

  constructor(public context: string) {}
}

export class HikeProgramModified implements Action {
  readonly type = HikeProgramActionTypes.HIKE_PROGRAM_MODIFIED;

  constructor(public context: string) {}
}

=======
>>>>>>> fix: adding multi language component
export type AllHikeActions =
  | LoadHikeProgram
  | HikeProgramLoaded
  | LoadHikeProgramFailed
  | LoadHikePrograms
<<<<<<< HEAD
  | AllHikeProgramsLoaded
  | SaveHikeProgram
  | HikeProgramSaved
  | HikeProgramModified;
=======
  | AllHikeProgramsLoaded;
>>>>>>> fix: adding multi language component
