import { Action } from '@ngrx/store';
import { ILocalizedItem, ITextualDescription, IHikeProgramStop, IBackgroundImageData } from 'subrepos/provider-client';

export const RESET_HIKE_PROGRAM = '[HikeProgram] Reset';
export const ADD_NEW_TRANSLATED_HIKE_DESCRIPTION = '[HikeProgram] Add new translated hike description';
export const DELETE_TRANSLATED_HIKE_DESCRIPTION = '[HikeProgram] Delete translated hike description';
export const ADD_HIKE_PROGRAM_DETAILS = '[HikeProgram] Add some details';
export const ADD_STOP = '[HikeProgram] Add stop';
export const SET_STOPS = '[HikeProgram] Set stops';
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

  constructor(
    public languageKey: string,
    public content: ITextualDescription
  ) {}
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
  distance?: number;
  uphill?: number;
  downhill?: number;
  time?: number;
  score?: number;
  location?: string;
}

export class AddHikeProgramDetails implements Action {
  readonly type = ADD_HIKE_PROGRAM_DETAILS;

  constructor(public details: IDetails, public setDirty: boolean) {}
}

export class AddStop implements Action {
  readonly type = ADD_STOP;
  constructor(public stop: IHikeProgramStop) {}
}

export class SetStops implements Action {
  readonly type = SET_STOPS;
  constructor(public stops: IHikeProgramStop[]) {}
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
  | AddStop
  | SetStops
  | RemoveStopByPoiId
  | SaveHikeProgram
  | HikeProgramSaveSuccess
  | HikeProgramSaveFailed
  | AddHikeProgramBackgroundImage
  | RemoveHikeProgramBackgroundImage;
