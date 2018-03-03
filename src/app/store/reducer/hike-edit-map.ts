import { IHikeEditMapMapState, IWikipediaMarkerEntityState, IHikeEditMapState, IGoogleMarkerEntityState, IOsmRoutePoiEntityState, IOsmRouteMarkerEntityState, IOsmNaturalMarkerEntityState, IOsmAmenityMarkerEntityState, IGTrackMarkerEntityState } from '../state';
import { adminMapActions, hikeEditMapActions } from '../index';
import { EntityAdapter } from '@ngrx/entity/src/models';
import { createEntityAdapter } from '@ngrx/entity/src/create_adapter';
import { ActionReducer, ActionReducerMap } from '@ngrx/store/src/models';
import { combineReducers } from '@ngrx/store/src/utils';
import { AdminMapMarker } from 'app/shared/services/admin-map';

/**
 * Map
 */

export const initialMapState: IHikeEditMapMapState = {
  mapId: ''
};

export function hikeEditMapMapReducer(
  state = initialMapState,
  action: adminMapActions.AllAdminMapActions
): IHikeEditMapMapState {
  switch (action.type) {
    case adminMapActions.REGISTER_MAP:
      return {
        ...state,
        mapId: action.payload.mapId
      };
    default:
      return state;
  }
}

/**
 * Wikipedia markers
 */

export const wikipediaMarkerAdapter: EntityAdapter<AdminMapMarker> = createEntityAdapter<AdminMapMarker>();
export const wikipediaMarkerEntityInitialState = wikipediaMarkerAdapter.getInitialState();

const wikipediaMarkerReducer: ActionReducer<IWikipediaMarkerEntityState> = (
  state: IWikipediaMarkerEntityState = wikipediaMarkerEntityInitialState,
  action: hikeEditMapActions.AllHikeEditMapActions
): IWikipediaMarkerEntityState => {
  switch (action.type) {
    case hikeEditMapActions.RESET: {
      return wikipediaMarkerEntityInitialState;
    }
    case hikeEditMapActions.SET_WIKIPEDIA_MARKERS: {
      return wikipediaMarkerAdapter.addAll(action.payload.markers, state);
    }
    default:
      return state;
  }
}

/**
 * Google markers
 */

export const googleMarkerAdapter: EntityAdapter<AdminMapMarker> = createEntityAdapter<AdminMapMarker>();
export const googleMarkerEntityInitialState = googleMarkerAdapter.getInitialState();

const googleMarkerReducer: ActionReducer<IGoogleMarkerEntityState> = (
  state: IGoogleMarkerEntityState = googleMarkerEntityInitialState,
  action: hikeEditMapActions.AllHikeEditMapActions
): IGoogleMarkerEntityState => {
  switch (action.type) {
    case hikeEditMapActions.RESET: {
      return googleMarkerEntityInitialState;
    }
    case hikeEditMapActions.SET_GOOGLE_MARKERS: {
      return googleMarkerAdapter.addAll(action.payload.markers, state);
    }
    default:
      return state;
  }
}

/**
 * OSM amenity markers
 */

export const osmAmenityMarkerAdapter: EntityAdapter<AdminMapMarker> = createEntityAdapter<AdminMapMarker>();
export const osmAmenityMarkerEntityInitialState = osmAmenityMarkerAdapter.getInitialState();

const osmAmenityMarkerReducer: ActionReducer<IOsmAmenityMarkerEntityState> = (
  state: IOsmAmenityMarkerEntityState = osmAmenityMarkerEntityInitialState,
  action: hikeEditMapActions.AllHikeEditMapActions
): IOsmAmenityMarkerEntityState => {
  switch (action.type) {
    case hikeEditMapActions.RESET: {
      return osmAmenityMarkerEntityInitialState;
    }
    case hikeEditMapActions.SET_OSM_AMENITY_MARKERS: {
      return osmAmenityMarkerAdapter.addAll(action.payload.markers, state);
    }
    default:
      return state;
  }
}

/**
 * OSM natural markers
 */

export const osmNaturalMarkerAdapter: EntityAdapter<AdminMapMarker> = createEntityAdapter<AdminMapMarker>();
export const osmNaturalMarkerEntityInitialState = osmNaturalMarkerAdapter.getInitialState();

const osmNaturalMarkerReducer: ActionReducer<IOsmNaturalMarkerEntityState> = (
  state: IOsmNaturalMarkerEntityState = osmNaturalMarkerEntityInitialState,
  action: hikeEditMapActions.AllHikeEditMapActions
): IOsmNaturalMarkerEntityState => {
  switch (action.type) {
    case hikeEditMapActions.RESET: {
      return osmNaturalMarkerEntityInitialState;
    }
    case hikeEditMapActions.SET_OSM_NATURAL_MARKERS: {
      return osmNaturalMarkerAdapter.addAll(action.payload.markers, state);
    }
    default:
      return state;
  }
}

/**
 * OSM route markers
 */

export const osmRouteMarkerAdapter: EntityAdapter<AdminMapMarker> = createEntityAdapter<AdminMapMarker>();
export const osmRouteMarkerEntityInitialState = osmRouteMarkerAdapter.getInitialState();

const osmRouteMarkerReducer: ActionReducer<IOsmRouteMarkerEntityState> = (
  state: IOsmRouteMarkerEntityState = osmRouteMarkerEntityInitialState,
  action: hikeEditMapActions.AllHikeEditMapActions
): IOsmRouteMarkerEntityState => {
  switch (action.type) {
    case hikeEditMapActions.RESET: {
      return osmRouteMarkerEntityInitialState;
    }
    case hikeEditMapActions.SET_OSM_ROUTE_MARKERS: {
      return osmRouteMarkerAdapter.addAll(action.payload.markers, state);
    }
    default:
      return state;
  }
}

/**
 * gTrack markers
 */

export const gTrackMarkerAdapter: EntityAdapter<AdminMapMarker> = createEntityAdapter<AdminMapMarker>();
export const gTrackMarkerEntityInitialState = gTrackMarkerAdapter.getInitialState();

const gTrackMarkerReducer: ActionReducer<IGTrackMarkerEntityState> = (
  state: IGTrackMarkerEntityState = gTrackMarkerEntityInitialState,
  action: hikeEditMapActions.AllHikeEditMapActions
): IGTrackMarkerEntityState => {
  switch (action.type) {
    case hikeEditMapActions.RESET:
      return gTrackMarkerEntityInitialState;
    case hikeEditMapActions.SET_GTRACK_MARKERS: {
      return gTrackMarkerAdapter.addAll(action.payload.markers, state);
    }
    default:
      return state;
  }
}

const reducerMap: ActionReducerMap<IHikeEditMapState> = {
  wikipediaMarkers: wikipediaMarkerReducer,
  googleMarkers: googleMarkerReducer,
  osmAmenityMarkers: osmAmenityMarkerReducer,
  osmNaturalMarkers: osmNaturalMarkerReducer,
  osmRouteMarkers: osmRouteMarkerReducer,
  gTrackMarkers: gTrackMarkerReducer,
  map: hikeEditMapMapReducer
};

export const hikeEditMapReducer = combineReducers(reducerMap);
