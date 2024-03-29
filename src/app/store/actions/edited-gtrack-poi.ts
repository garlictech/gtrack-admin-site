// tslint:disable:no-property-initializers max-classes-per-file
import {
  BackgroundImageData,
  PoiStored,
  TextualDescription
} from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { Action } from '@ngrx/store';

export const ADD_NEW_TRANSLATED_POI_DESCRIPTION = '[Gtrack Poi Edit] Add new translated poi description';
export const DELETE_TRANSLATED_POI_DESCRIPTION = '[Gtrack Poi Edit] Delete translated poi description';
export const LOAD_POI = '[Gtrack Poi Edit] Load poi to the editor space';
export const SAVE_POI = '[Gtrack Poi Edit] Save poi';
export const POI_SAVE_SUCCESS = '[Gtrack Poi Edit] Poi saved successfully';
export const POI_SAVE_FAILED = '[Gtrack Poi Edit] Poi save failure';
export const ADD_POI_BACKGROUND_IMAGE = '[Gtrack Poi Edit] Add background image';
export const REMOVE_POI_BACKGROUND_IMAGE = '[Gtrack Poi Edit] Remove background image';

export class AddNewTranslatedPoiDescription implements Action {
  readonly type = ADD_NEW_TRANSLATED_POI_DESCRIPTION;

  constructor(public languageKey: string, public content: TextualDescription) {}
}

export class DeleteTranslatedPoiDescription implements Action {
  readonly type = DELETE_TRANSLATED_POI_DESCRIPTION;

  constructor(public languageKey: string) {}
}

export class SavePoi implements Action {
  readonly type = SAVE_POI;
}

export class PoiSaveSuccess implements Action {
  readonly type = POI_SAVE_SUCCESS;

  constructor(public poiId: string) {}
}

export class PoiSaveFailed implements Action {
  readonly type = POI_SAVE_FAILED;

  constructor(public error: any) {}
}

export class LoadPoi implements Action {
  readonly type = LOAD_POI;

  constructor(public data: PoiStored) {}
}

export class AddPoiBackgroundImage implements Action {
  readonly type = ADD_POI_BACKGROUND_IMAGE;

  constructor(public imageData: BackgroundImageData) {}
}

export class RemovePoiBackgroundImage implements Action {
  readonly type = REMOVE_POI_BACKGROUND_IMAGE;

  constructor(public origUrl: string) {}
}

export type AllEditedGTrackPoiActions =
  | AddNewTranslatedPoiDescription
  | DeleteTranslatedPoiDescription
  | SavePoi
  | PoiSaveSuccess
  | PoiSaveFailed
  | LoadPoi
  | AddPoiBackgroundImage
  | RemovePoiBackgroundImage;
