import { Action, ActionReducer, ActionReducerMap, combineReducers } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { IBackgroundImageDataStored } from 'app/shared/interfaces';
import { IMapillaryImageEntityState, hikeEditImageActions, IImageListContextState, IHikeEditImageState } from '../index';
import * as _ from 'lodash';

/**
 * Mapillary
 */

export const mapillaryImageAdapter: EntityAdapter<IBackgroundImageDataStored> = createEntityAdapter<IBackgroundImageDataStored>();
export const mapillaryImageInitialState = mapillaryImageAdapter.getInitialState();

const mapillaryImageReducer: ActionReducer<IMapillaryImageEntityState> = (
  state: IMapillaryImageEntityState = mapillaryImageInitialState,
  action: hikeEditImageActions.AllHikeEditImageActions
): IMapillaryImageEntityState => {
  switch (action.type) {

    case hikeEditImageActions.RESET_IMAGE_STATE: {
      return mapillaryImageInitialState;
    }

    case hikeEditImageActions.SET_MAPILLARY_IMAGES: {
      return mapillaryImageAdapter.addAll(action.images, state);
    }

    default:
      return state;

  }
}

/**
 * Context
 */

const initialContextItemState = {
  loading: false,
  loaded: false,
  saving: false
};

export const imageListInitialContextState: IImageListContextState = {
  mapillary: _.cloneDeep(initialContextItemState)
};

export function imageListContextReducer(
  state = imageListInitialContextState,
  action: hikeEditImageActions.AllHikeEditImageActions
): IImageListContextState {
  switch (action.type) {

    case hikeEditImageActions.RESET_IMAGE_STATE:
      return imageListInitialContextState;

    /**
     * Mapillary
     */
    case hikeEditImageActions.GET_MAPILLARY_IMAGES: {
      return {
        ...state,
        mapillary: {
          ...state.mapillary,
          loading: true,
          loaded: false
        }
      };
    }

    case hikeEditImageActions.SET_MAPILLARY_IMAGES: {
      return {
        ...state,
        mapillary: {
          ...state.mapillary,
          loading: false,
          loaded: true
        }
      };
    }

    default:
      return state;

  }
}

const reducerMap: ActionReducerMap<IHikeEditImageState> = {
  mapillaryImages: mapillaryImageReducer,
  contexts: imageListContextReducer
};

export const hikeEditImageReducer = combineReducers(reducerMap);
