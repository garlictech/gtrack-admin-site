import { Action, ActionReducer, ActionReducerMap, combineReducers } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import {
  IHikeEditPoiState, IWikipediaPoiEntityState, IGooglePoiEntityState, IOsmAmenityPoiEntityState,
  IOsmNaturalPoiEntityState, IOsmRoutePoiEntityState, IExternalPoiListContextState
} from '../state';
import { IWikipediaPoi, IGooglePoi, IOsmPoi } from 'app/shared/interfaces';
import { hikeEditPoiActions } from '../index';
import { poiReducer } from 'subrepos/gtrack-common-ngx';
import { IPoi } from 'subrepos/provider-client';

/**
 * Google
 */

export const googlePoiAdapter: EntityAdapter<IGooglePoi> = createEntityAdapter<IGooglePoi>();
export const googlePoiInitialState = googlePoiAdapter.getInitialState();

const googlePoiReducer: ActionReducer<IGooglePoiEntityState> = (
  state: IGooglePoiEntityState = googlePoiInitialState,
  action: hikeEditPoiActions.AllHikeEditPoiActions
): IGooglePoiEntityState => {
  switch (action.type) {
    case hikeEditPoiActions.SET_GOOGLE_POIS: {
      return googlePoiAdapter.addAll(action.payload.pois, state);
    }
    case hikeEditPoiActions.SET_GOOGLE_POI_IN_HIKE:
      return googlePoiAdapter.updateOne({
        id: action.payload.poiId,
        changes: {
          inHike: action.payload.isInHike
        }
      }, state);
    default:
      return state;
  }
}

/**
 * OSM Amenity
 */

export const osmAmenityPoiAdapter: EntityAdapter<IOsmPoi> = createEntityAdapter<IOsmPoi>();
export const osmAmenityPoiInitialState = osmAmenityPoiAdapter.getInitialState();

const osmAmenityPoiReducer: ActionReducer<IOsmAmenityPoiEntityState> = (
  state: IOsmAmenityPoiEntityState = osmAmenityPoiInitialState,
  action: hikeEditPoiActions.AllHikeEditPoiActions
): IOsmAmenityPoiEntityState => {
  switch (action.type) {
    case hikeEditPoiActions.SET_OSM_AMENITY_POIS: {
      return osmAmenityPoiAdapter.addAll(action.payload.pois, state);
    }
    case hikeEditPoiActions.SET_OSM_AMENITY_POI_IN_HIKE:
      return osmAmenityPoiAdapter.updateOne({
        id: action.payload.poiId,
        changes: {
          inHike: action.payload.isInHike
        }
      }, state);
    default:
      return state;
  }
}

/**
 * OSM Natural
 */

export const osmNaturalPoiAdapter: EntityAdapter<IOsmPoi> = createEntityAdapter<IOsmPoi>();
export const osmNaturalPoiInitialState = osmNaturalPoiAdapter.getInitialState();

const osmNaturalPoiReducer: ActionReducer<IOsmNaturalPoiEntityState> = (
  state: IOsmNaturalPoiEntityState = osmNaturalPoiInitialState,
  action: hikeEditPoiActions.AllHikeEditPoiActions
): IOsmNaturalPoiEntityState => {
  switch (action.type) {
    case hikeEditPoiActions.SET_OSM_NATURAL_POIS: {
      return osmNaturalPoiAdapter.addAll(action.payload.pois, state);
    }
    case hikeEditPoiActions.SET_OSM_NATURAL_POI_IN_HIKE:
      return osmNaturalPoiAdapter.updateOne({
        id: action.payload.poiId,
        changes: {
          inHike: action.payload.isInHike
        }
      }, state);
    default:
      return state;
  }
}

/**
 * OSM Route
 */

export const osmRoutePoiAdapter: EntityAdapter<IOsmPoi> = createEntityAdapter<IOsmPoi>();
export const osmRoutePoiInitialState = osmRoutePoiAdapter.getInitialState();

const osmRoutePoiReducer: ActionReducer<IOsmRoutePoiEntityState> = (
  state: IOsmRoutePoiEntityState = osmRoutePoiInitialState,
  action: hikeEditPoiActions.AllHikeEditPoiActions
): IOsmRoutePoiEntityState => {
  switch (action.type) {
    case hikeEditPoiActions.SET_OSM_ROUTE_POIS: {
      return osmRoutePoiAdapter.addAll(action.payload.pois, state);
    }
    case hikeEditPoiActions.SET_OSM_ROUTE_POI_IN_HIKE:
      return osmRoutePoiAdapter.updateOne({
        id: action.payload.poiId,
        changes: {
          inHike: action.payload.isInHike
        }
      }, state);
    default:
      return state;
  }
}

/**
 * Wikipedia
 */

export const wikipediaPoiAdapter: EntityAdapter<IWikipediaPoi> = createEntityAdapter<IWikipediaPoi>();
export const wikipediaPoiInitialState = wikipediaPoiAdapter.getInitialState();

const wikipediaPoiReducer: ActionReducer<IWikipediaPoiEntityState> = (
  state: IWikipediaPoiEntityState = wikipediaPoiInitialState,
  action: hikeEditPoiActions.AllHikeEditPoiActions
): IWikipediaPoiEntityState => {
  switch (action.type) {
    case hikeEditPoiActions.SET_WIKIPEDIA_POIS: {
      return wikipediaPoiAdapter.addAll(action.payload.pois, state);
    }
    case hikeEditPoiActions.SET_WIKIPEDIA_POI_IN_HIKE:
      return wikipediaPoiAdapter.updateOne({
        id: action.payload.poiId,
        changes: {
          inHike: action.payload.isInHike
        }
      }, state);
    default:
      return state;
  }
}

/**
 * Context
 */

const initialContextItemState = {
  loading: false,
  showOnrouteMarkers: true,
  showOffrouteMarkers: false
};
export const externalPoiInitialContextState: IExternalPoiListContextState = {
  google: initialContextItemState,
  osmAmenity: initialContextItemState,
  osmNatural: initialContextItemState,
  osmRoute: initialContextItemState,
  wikipedia: initialContextItemState
};

export function externalPoiListContextReducer(
  state = externalPoiInitialContextState,
  action: hikeEditPoiActions.AllHikeEditPoiActions
): IExternalPoiListContextState {
  switch (action.type) {
    /**
     * Wikipedia
     */
    case hikeEditPoiActions.GET_WIKIPEDIA_POIS: {
      return {
        ...state,
        wikipedia: {
          ...state.wikipedia,
          loading: true
        }
      };
    }
    case hikeEditPoiActions.SET_WIKIPEDIA_POIS: {
      return {
        ...state,
        wikipedia: {
          ...state.wikipedia,
          loading: false
        }
      };
    }

    /**
     * Google
     */
    case hikeEditPoiActions.GET_GOOGLE_POIS: {
      return {
        ...state,
        google: {
          ...state.google,
          loading: true
        }
      };
    }
    case hikeEditPoiActions.SET_GOOGLE_POIS: {
      return {
        ...state,
        google: {
          ...state.google,
          loading: false
        }
      };
    }

    /**
     * OSM amenity
     */
    case hikeEditPoiActions.GET_OSM_AMENITY_POIS: {
      return {
        ...state,
        osmAmenity: {
          ...state.osmAmenity,
          loading: true
        }
      };
    }
    case hikeEditPoiActions.SET_OSM_AMENITY_POIS: {
      return {
        ...state,
        osmAmenity: {
          ...state.osmAmenity,
          loading: false
        }
      };
    }

    /**
     * OSM natural
     */
    case hikeEditPoiActions.GET_OSM_NATURAL_POIS: {
      return {
        ...state,
        osmNatural: {
          ...state.osmNatural,
          loading: true
        }
      };
    }
    case hikeEditPoiActions.SET_OSM_NATURAL_POIS: {
      return {
        ...state,
        osmNatural: {
          ...state.osmNatural,
          loading: false
        }
      };
    }

    /**
     * OSM route
     */
    case hikeEditPoiActions.GET_OSM_ROUTE_POIS: {
      return {
        ...state,
        osmRoute: {
          ...state.osmRoute,
          loading: true
        }
      };
    }
    case hikeEditPoiActions.SET_OSM_ROUTE_POIS: {
      return {
        ...state,
        osmRoute: {
          ...state.osmRoute,
          loading: false
        }
      };
    }

    /**
     * Toggle markers
     */
    case hikeEditPoiActions.TOGGLE_ONROUTE_MARKERS:
      return {
        ...state,
        [action.payload.subdomain]: {
          ...state[action.payload.subdomain],
          showOnrouteMarkers: !state[action.payload.subdomain].showOnrouteMarkers
        }
      };
    case hikeEditPoiActions.TOGGLE_OFFROUTE_MARKERS:
      return {
        ...state,
        [action.payload.subdomain]: {
          ...state[action.payload.subdomain],
          showOffrouteMarkers: !state[action.payload.subdomain].showOffrouteMarkers
        }
      };

    default:
      return state;
  }
}

const reducerMap: ActionReducerMap<IHikeEditPoiState> = {
  wikipediaPois: wikipediaPoiReducer,
  googlePois: googlePoiReducer,
  osmAmenityPois: osmAmenityPoiReducer,
  osmNaturalPois: osmNaturalPoiReducer,
  osmRoutePois: osmRoutePoiReducer,
  contexts: externalPoiListContextReducer
};

export const hikeEditPoiReducer = combineReducers(reducerMap);
