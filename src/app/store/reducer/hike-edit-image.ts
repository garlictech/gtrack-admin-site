// tslint:disable:only-arrow-functions no-small-switch
import _cloneDeep from 'lodash-es/cloneDeep';

import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { ActionReducerMap, combineReducers } from '@ngrx/store';

import { BackgroundImageDataStored } from '../../shared/interfaces';
import { hikeEditImageActions } from '../actions';
import { HikeEditImageState, ImageListContextState, MapillaryImageEntityState } from '../index';
import { FlickrImageEntityState, ImageMarkerState } from '../state';

/**
 * Mapillary
 */

export const mapillaryImageAdapter: EntityAdapter<BackgroundImageDataStored> = createEntityAdapter<
  BackgroundImageDataStored
>();
export const mapillaryImageInitialState = mapillaryImageAdapter.getInitialState();

export function mapillaryImageReducer(
  state: MapillaryImageEntityState = mapillaryImageInitialState,
  action: hikeEditImageActions.AllHikeEditImageActions
): MapillaryImageEntityState {
  switch (action.type) {
    case hikeEditImageActions.RESET_IMAGE_STATE: {
      return { ...mapillaryImageInitialState };
    }

    case hikeEditImageActions.SET_MAPILLARY_IMAGES: {
      return mapillaryImageAdapter.addAll(action.images, state);
    }

    default:
      return state;
  }
}

/**
 * Flickr
 */

export const flickrImageAdapter: EntityAdapter<BackgroundImageDataStored> = createEntityAdapter<
  BackgroundImageDataStored
>();
export const flickrImageInitialState = flickrImageAdapter.getInitialState();

export function flickrImageReducer(
  state: FlickrImageEntityState = flickrImageInitialState,
  action: hikeEditImageActions.AllHikeEditImageActions
): FlickrImageEntityState {
  switch (action.type) {
    case hikeEditImageActions.RESET_IMAGE_STATE: {
      return { ...flickrImageInitialState };
    }

    case hikeEditImageActions.SET_FLICKR_IMAGES: {
      return flickrImageAdapter.addAll(action.images, state);
    }

    default:
      return state;
  }
}

/**
 * Context
 */

export const initialImageMarkerState: ImageMarkerState = {
  images: []
};

export function imageMarkerReducer(
  state = initialImageMarkerState,
  action: hikeEditImageActions.AllHikeEditImageActions
): ImageMarkerState {
  switch (action.type) {
    case hikeEditImageActions.RESET_IMAGE_STATE:
      return { ...initialImageMarkerState };

    /**
     * Image marker urls
     */
    case hikeEditImageActions.ADD_IMAGE_MARKER: {
      return {
        ...state,
        images: [...(state.images as any), action.image]
      };
    }

    case hikeEditImageActions.ADD_IMAGE_MARKERS: {
      return {
        ...state,
        images: [...(state.images as any), ...action.images]
      };
    }

    case hikeEditImageActions.REMOVE_IMAGE_MARKER: {
      return {
        ...state,
        images: (state.images as any).filter(img => img.original.url !== action.image.original.url)
      };
    }

    case hikeEditImageActions.REMOVE_IMAGE_MARKERS: {
      return {
        ...state,
        images: (state.images as any).filter(img => !action.images.map(i => i.original.url).includes(img.original.url))
      };
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

export const imageListInitialContextState: ImageListContextState = {
  mapillary: _cloneDeep(initialContextItemState),
  flickr: _cloneDeep(initialContextItemState)
};

export function imageListContextReducer(
  state = imageListInitialContextState,
  action: hikeEditImageActions.AllHikeEditImageActions
): ImageListContextState {
  switch (action.type) {
    case hikeEditImageActions.RESET_IMAGE_STATE:
      return { ...imageListInitialContextState };

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

    /**
     * Flickr
     */
    case hikeEditImageActions.GET_FLICKR_IMAGES: {
      return {
        ...state,
        flickr: {
          ...state.flickr,
          loading: true,
          loaded: false
        }
      };
    }

    case hikeEditImageActions.SET_FLICKR_IMAGES: {
      return {
        ...state,
        flickr: {
          ...state.flickr,
          loading: false,
          loaded: true
        }
      };
    }

    default:
      return state;
  }
}

const reducerMap: ActionReducerMap<HikeEditImageState> = {
  mapillaryImages: mapillaryImageReducer,
  flickrImages: flickrImageReducer,
  imageMarkerImages: imageMarkerReducer,
  contexts: imageListContextReducer
};

export const hikeEditImageReducer = combineReducers(reducerMap);
