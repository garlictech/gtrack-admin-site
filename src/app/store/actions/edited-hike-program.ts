// tslint:disable:no-property-initializers max-classes-per-file
import { CheckpointSequence } from 'subrepos/gtrack-common-ngx';

import {
  BackgroundImageData,
  EHikeProgramDifficulty,
  HikeProgramStop,
  TextualDescription
} from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { Action } from '@ngrx/store';

import { GTrackPoi } from '../../shared/interfaces';

export const RESET_HIKE_PROGRAM = '[HikeProgram] Reset';
export const ADD_NEW_TRANSLATED_HIKE_DESCRIPTION = '[HikeProgram] Add new translated hike description';
export const DELETE_TRANSLATED_HIKE_DESCRIPTION = '[HikeProgram] Delete translated hike description';
export const ADD_HIKE_PROGRAM_DETAILS = '[HikeProgram] Add some details';
export const SET_HIKE_PROGRAM_LOCATION = '[HikeProgram] Set location';
export const SET_HIKE_PROGRAM_IS_ROUNDTRIP = '[HikeProgram] Set isRoundtrip';
export const SET_HIKE_PROGRAM_IS_FEATURE = '[HikeProgram] Set isFeature';
export const SET_HIKE_PROGRAM_ID = '[HikeProgram] Set id';
export const SET_HIKE_PROGRAM_ROUTE_ID = '[HikeProgram] Set routeId';
export const SET_HIKE_PROGRAM_TOTALS = '[HikeProgram] Set totals';
export const SET_HIKE_PROGRAM_DESCRIPTION = '[HikeProgram] Set description';
export const SET_HIKE_PROGRAM_ICONS = '[HikeProgram] Set icons';
export const SET_HIKE_PROGRAM_DIFFICULTY = '[HikeProgram] Set difficulty';
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

  constructor(public languageKey: string, public content: TextualDescription) {}
}

export class DeleteTranslatedHikeProgramDescription implements Action {
  readonly type = DELETE_TRANSLATED_HIKE_DESCRIPTION;

  constructor(public languageKey: string) {}
}

export interface Details {
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

  constructor(public details: Details, public setDirty: boolean) {}
}

export class SetHikeProgramLocation implements Action {
  readonly type = SET_HIKE_PROGRAM_LOCATION;

  constructor(public location: string) {}
}

export class SetHikeProgramIsRoundTrip implements Action {
  readonly type = SET_HIKE_PROGRAM_IS_ROUNDTRIP;

  constructor(public isRoundTrip: boolean) {}
}

export class SetHikeProgramIsFeature implements Action {
  readonly type = SET_HIKE_PROGRAM_IS_FEATURE;

  constructor(public isFeature: boolean) {}
}

export class SetHikeProgramId implements Action {
  readonly type = SET_HIKE_PROGRAM_ID;

  constructor(public id: string) {}
}

export class SetHikeProgramRouteId implements Action {
  readonly type = SET_HIKE_PROGRAM_ROUTE_ID;

  constructor(public routeId: string) {}
}

export class SetHikeProgramTotals implements Action {
  readonly type = SET_HIKE_PROGRAM_TOTALS;

  constructor(public totals: any) {}
}

export class SetHikeProgramDescription implements Action {
  readonly type = SET_HIKE_PROGRAM_DESCRIPTION;

  constructor(public description: any) {}
}

export class SetHikeProgramIcons implements Action {
  readonly type = SET_HIKE_PROGRAM_ICONS;

  constructor(public elevationIcon: string, public routeIcon: string) {}
}

export class SetHikeProgramDifficulty implements Action {
  readonly type = SET_HIKE_PROGRAM_DIFFICULTY;

  constructor(public difficulty: EHikeProgramDifficulty) {}
}

export class AddStop implements Action {
  readonly type = ADD_STOP;
  constructor(public stop: HikeProgramStop) {}
}

export class PrepareThenAddStop implements Action {
  readonly type = PREPARE_THEN_ADD_STOP;
  constructor(public poi: GTrackPoi) {}
}

export class SetStops implements Action {
  readonly type = SET_STOPS;
  constructor(public stops: Array<HikeProgramStop>) {}
}

export class SetReverseStops implements Action {
  readonly type = SET_REVERSE_STOPS;
  constructor(public stops: Array<HikeProgramStop>) {}
}

export class SetCheckpoints implements Action {
  readonly type = SET_CHECKPOINTS;
  constructor(public checkpoints: CheckpointSequence) {}
}

export class RemoveStopByPoiId implements Action {
  readonly type = REMOVE_STOP_BY_POI_ID;
  constructor(public poiIds: Array<string>) {}
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

  constructor(public imageData: BackgroundImageData) {}
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
  | SetHikeProgramLocation
  | SetHikeProgramDescription
  | SetHikeProgramIsRoundTrip
  | SetHikeProgramIsFeature
  | SetHikeProgramTotals
  | SetHikeProgramId
  | SetHikeProgramRouteId
  | SetHikeProgramIcons
  | SetHikeProgramDifficulty
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
