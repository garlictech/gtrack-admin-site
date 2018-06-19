import { Action } from '@ngrx/store';
import { ILocalizedItem, ITextualDescription, IPoiStored, IBackgroundImageData } from 'subrepos/provider-client';

export const ADD_NEW_TRANSLATED_POI_DESCRIPTION = '[Gtrack Poi Edit] Add new translated poi description';
export const DELETE_TRANSLATED_POI_DESCRIPTION = '[Gtrack Poi Edit] Delete translated poi description';
export const LOAD_POI = '[Gtrack Poi Edit] Load poi to the editor space';
export const SAVE_POI = '[Gtrack Poi Edit] Save poi';
export const POI_SAVE_SUCCESS = '[Gtrack Poi Edit] Poi saved successfully';
export const POI_SAVE_FAILED = '[Gtrack Poi Edit] Poi save failure';
export const ADD_BACKGROUND_IMAGE = '[Gtrack Poi Edit] Add background image';
export const REMOVE_BACKGROUND_IMAGE = '[Gtrack Poi Edit] Remove background image';

export class AddNewTranslatedPoiDescription implements Action {
  readonly type = ADD_NEW_TRANSLATED_POI_DESCRIPTION;

  constructor(
    public languageKey: string,
    public content: ITextualDescription
  ) {}
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

  constructor(public data: IPoiStored) {}
}

export class AddBackgroundImage implements Action {
  readonly type = ADD_BACKGROUND_IMAGE;

  constructor(public imageData: IBackgroundImageData) {}
}

export class RemoveBackgroundImage implements Action {
  readonly type = REMOVE_BACKGROUND_IMAGE;

  constructor(public origUrl: string) {}
}

export type AllEditedGTrackPoiActions =
  | AddNewTranslatedPoiDescription
  | DeleteTranslatedPoiDescription
  | SavePoi
  | PoiSaveSuccess
  | PoiSaveFailed
  | LoadPoi
  | AddBackgroundImage
  | RemoveBackgroundImage;
