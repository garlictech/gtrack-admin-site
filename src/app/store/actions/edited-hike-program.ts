import { Action } from '@ngrx/store';
import { ITextualDescription, IHikeProgramStop, IBackgroundImageData } from 'subrepos/provider-client';
import { IGTrackPoi } from '../../shared/interfaces';
import { CheckpointSequence } from 'subrepos/gtrack-common-ngx';

export const RESET_HIKE_PROGRAM = '[HikeProgram] Reset';
export const ADD_NEW_TRANSLATED_HIKE_DESCRIPTION = '[HikeProgram] Add new translated hike description';
export const DELETE_TRANSLATED_HIKE_DESCRIPTION = '[HikeProgram] Delete translated hike description';
export const ADD_HIKE_PROGRAM_DETAILS = '[HikeProgram] Add some details';
export const PREPARE_THEN_ADD_STOP = '[HikeProgram] Prepare then add stop';
export const ADD_STOP = '[HikeProgram] Add stop';
export const SET_STOPS = '[HikeProgram] Set stops';
export const SET_REVERSE_STOPS = '[HikeProgram] Set reverse stops';
export const SET_CHECKPOINTS = '[HikeProgram] Set checkpoints';
export const REMOVE_STOP_BY_POI_ID = '[HikeProgram] Remove stop by poi id';
export const SAVE_HIKE_PROGRAM = '[HikeProgram] Save hike program';
export const HIKE_PROGRAM_SAVE_SUCCESS = '[HikeProgram] Hike program saved successfully';
export const HIKE_PROGRAM_SAVE_FAILED = '[HikeProgram] Hike program save failure';
export const ADD_HIKE_PROGRAM_BACKGROUND_IMAGE = '[HikeProgram] Add background image';
export const REMOVE_HIKE_PROGRAM_BACKGROUND_IMAGE = '[HikeProgram] Remove background image';

export class ResetHikeProgram implements Action {
  readonly type = RESET_HIKE_PROGRAM;
}

export class AddNewTranslatedHikeProgramDescription implements Action {
  readonly type = ADD_NEW_TRANSLATED_HIKE_DESCRIPTION;

  constructor(public languageKey: string, public content: ITextualDescription) {}
}

export class DeleteTranslatedHikeProgramDescription implements Action {
  readonly type = DELETE_TRANSLATED_HIKE_DESCRIPTION;

  constructor(public languageKey: string) {}
}

export interface IDetails {
  id?: string;
  routeId?: string;
  difficulty?: number;
  isRoundTrip?: boolean;
  feature?: boolean;
  distance?: number;
  uphill?: number;
  downhill?: number;
  time?: number;
  reverseTime?: number;
  score?: number;
  reverseScore?: number;
  location?: string;
  routeIcon?: string;
  elevationIcon?: string;
}

export class AddHikeProgramDetails implements Action {
  readonly type = ADD_HIKE_PROGRAM_DETAILS;

  constructor(public details: IDetails, public setDirty: boolean) {}
}

export class AddStop implements Action {
  readonly type = ADD_STOP;
  constructor(public stop: IHikeProgramStop) {}
}

export class PrepareThenAddStop implements Action {
  readonly type = PREPARE_THEN_ADD_STOP;
  constructor(public poi: IGTrackPoi) {}
}

export class SetStops implements Action {
  readonly type = SET_STOPS;
  constructor(public stops: IHikeProgramStop[]) {}
}

export class SetReverseStops implements Action {
  readonly type = SET_REVERSE_STOPS;
  constructor(public stops: IHikeProgramStop[]) {}
}

export class SetCheckpoints implements Action {
  readonly type = SET_CHECKPOINTS;
  constructor(public checkpoints: CheckpointSequence) {}
}

export class RemoveStopByPoiId implements Action {
  readonly type = REMOVE_STOP_BY_POI_ID;
  constructor(public poiIds: string[]) {}
}

export class SaveHikeProgram implements Action {
  readonly type = SAVE_HIKE_PROGRAM;
}

export class HikeProgramSaveSuccess implements Action {
  readonly type = HIKE_PROGRAM_SAVE_SUCCESS;
}

export class HikeProgramSaveFailed implements Action {
  readonly type = HIKE_PROGRAM_SAVE_FAILED;

  constructor(public error: any) {}
}

export class AddHikeProgramBackgroundImage implements Action {
  readonly type = ADD_HIKE_PROGRAM_BACKGROUND_IMAGE;

  constructor(public imageData: IBackgroundImageData) {}
}

export class RemoveHikeProgramBackgroundImage implements Action {
  readonly type = REMOVE_HIKE_PROGRAM_BACKGROUND_IMAGE;

  constructor(public origUrl: string) {}
}

export type AllEditedHikeProgramActions =
  | ResetHikeProgram
  | AddNewTranslatedHikeProgramDescription
  | DeleteTranslatedHikeProgramDescription
  | AddHikeProgramDetails
  | PrepareThenAddStop
  | AddStop
  | SetStops
  | SetReverseStops
  | SetCheckpoints
  | RemoveStopByPoiId
  | SaveHikeProgram
  | HikeProgramSaveSuccess
  | HikeProgramSaveFailed
  | AddHikeProgramBackgroundImage
  | RemoveHikeProgramBackgroundImage;
