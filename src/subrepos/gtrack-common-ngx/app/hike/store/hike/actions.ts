import { Action } from '@ngrx/store';
import { IPoi, IHikeProgramStored } from 'subrepos/provider-client';

export enum HikeProgramActionTypes {
  LOAD_HIKE_PROGRAM = '[HikeProgram] Load hikeProgram',
  LOAD_HIKE_PROGRAM_FAILED = '[HikeProgram] Load hikeProgram failed',
  HIKE_PROGRAM_LOADED = '[HikeProgram] HikeProgram loaded',
  LOAD_HIKE_PROGRAMS = '[HikeProgram] Load hikePrograms',
  ALL_HIKE_PROGRAMS_LOADED = '[HikeProgram] All hikePrograms loaded'
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

export type AllHikeActions =
  | LoadHikeProgram
  | HikeProgramLoaded
  | LoadHikeProgramFailed
  | LoadHikePrograms
  | AllHikeProgramsLoaded;
