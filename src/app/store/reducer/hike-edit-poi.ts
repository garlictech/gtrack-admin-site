import { Action, ActionReducer, ActionReducerMap, combineReducers } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import {
  IHikeEditPoiState, IWikipediaPoiEntityState, IGooglePoiEntityState, IOsmAmenityPoiEntityState,
  IOsmNaturalPoiEntityState, IOsmRoutePoiEntityState, IExternalPoiListContextEntityState, IExternalPoiListContextState
} from '../state';
import { IWikipediaPoi, IGooglePoi, IOsmPoi } from 'app/shared/interfaces';
import { hikeEditPoiActions } from '../index';

/**
 * Wikipedia
 */

export const wikipediaPoiAdapter: EntityAdapter<IWikipediaPoi> = createEntityAdapter<IWikipediaPoi>();
const wikipediaPoiReducer: ActionReducer<IWikipediaPoiEntityState> = (
  state: IWikipediaPoiEntityState = wikipediaPoiAdapter.getInitialState(),
  action: hikeEditPoiActions.AllHikeEditPoiActions
): IWikipediaPoiEntityState => {
  switch (action.type) {
    case hikeEditPoiActions.SET_WIKIPEDIA_POIS: {
      return wikipediaPoiAdapter.addAll(action.payload.pois, state);
    }
    default:
      return state;
  }
}

/**
 * Google
 */

export const googlePoiAdapter: EntityAdapter<IGooglePoi> = createEntityAdapter<IGooglePoi>();
const googlePoiReducer: ActionReducer<IGooglePoiEntityState> = (
  state: IGooglePoiEntityState = googlePoiAdapter.getInitialState(),
  action: hikeEditPoiActions.AllHikeEditPoiActions
): IGooglePoiEntityState => {
  switch (action.type) {
    case hikeEditPoiActions.SET_GOOGLE_POIS: {
      return googlePoiAdapter.addAll(action.payload.pois, state);
    }
    default:
      return state;
  }
}

/**
 * OSM Amenity
 */

export const osmAmenityPoiAdapter: EntityAdapter<IOsmPoi> = createEntityAdapter<IOsmPoi>();
const osmAmenityPoiReducer: ActionReducer<IOsmAmenityPoiEntityState> = (
  state: IOsmAmenityPoiEntityState = osmAmenityPoiAdapter.getInitialState(),
  action: hikeEditPoiActions.AllHikeEditPoiActions
): IOsmAmenityPoiEntityState => {
  switch (action.type) {
    case hikeEditPoiActions.SET_OSM_AMENITY_POIS: {
      return osmAmenityPoiAdapter.addAll(action.payload.pois, state);
    }
    default:
      return state;
  }
}

/**
 * OSM Natural
 */

export const osmNaturalPoiAdapter: EntityAdapter<IOsmPoi> = createEntityAdapter<IOsmPoi>();
const osmNaturalPoiReducer: ActionReducer<IOsmNaturalPoiEntityState> = (
  state: IOsmNaturalPoiEntityState = osmNaturalPoiAdapter.getInitialState(),
  action: hikeEditPoiActions.AllHikeEditPoiActions
): IOsmNaturalPoiEntityState => {
  switch (action.type) {
    case hikeEditPoiActions.SET_OSM_NATURAL_POIS: {
      return osmNaturalPoiAdapter.addAll(action.payload.pois, state);
    }
    default:
      return state;
  }
}

/**
 * OSM Route
 */

export const osmRoutePoiAdapter: EntityAdapter<IOsmPoi> = createEntityAdapter<IOsmPoi>();
const osmRoutePoiReducer: ActionReducer<IOsmRoutePoiEntityState> = (
  state: IOsmRoutePoiEntityState = osmRoutePoiAdapter.getInitialState(),
  action: hikeEditPoiActions.AllHikeEditPoiActions
): IOsmRoutePoiEntityState => {
  switch (action.type) {
    case hikeEditPoiActions.SET_OSM_ROUTE_POIS: {
      return osmRoutePoiAdapter.addAll(action.payload.pois, state);
    }
    default:
      return state;
  }
}

/**
 * Context
 */

export const externalPoiListContextStateAdapter = createEntityAdapter<IExternalPoiListContextState>();
const poiContextReducer: ActionReducer<IExternalPoiListContextEntityState> = (
  state: IExternalPoiListContextEntityState = externalPoiListContextStateAdapter.getInitialState(),
  action: hikeEditPoiActions.AllHikeEditPoiActions
): IExternalPoiListContextEntityState => {
  const defaultChanges = {
    loading: false,
    showOnrouteMarkers: true,
    showOffrouteMarkers: false
  };

  switch (action.type) {
    case hikeEditPoiActions.GET_WIKIPEDIA_POIS: {
      return externalPoiListContextStateAdapter.addOne({
        id: 'wikipedia',
        loading: true
      }, state);
    }
    case hikeEditPoiActions.SET_WIKIPEDIA_POIS: {
      return externalPoiListContextStateAdapter.updateOne({
        id: 'wikipedia',
        changes: defaultChanges
      }, state);
    }
    case hikeEditPoiActions.GET_GOOGLE_POIS: {
      return externalPoiListContextStateAdapter.addOne({
        id: 'google',
        loading: true
      }, state);
    }
    case hikeEditPoiActions.SET_GOOGLE_POIS: {
      return externalPoiListContextStateAdapter.updateOne({
        id: 'google',
        changes: defaultChanges
      }, state);
    }
    case hikeEditPoiActions.GET_OSM_AMENITY_POIS: {
      return externalPoiListContextStateAdapter.addOne({
        id: 'osmAmenity',
        loading: true
      }, state);
    }
    case hikeEditPoiActions.SET_OSM_AMENITY_POIS: {
      return externalPoiListContextStateAdapter.updateOne({
        id: 'osmAmenity',
        changes: defaultChanges
      }, state);
    }
    case hikeEditPoiActions.GET_OSM_NATURAL_POIS: {
      return externalPoiListContextStateAdapter.addOne({
        id: 'osmNatural',
        loading: true
      }, state);
    }
    case hikeEditPoiActions.SET_OSM_NATURAL_POIS: {
      return externalPoiListContextStateAdapter.updateOne({
        id: 'osmNatural',
        changes: defaultChanges
      }, state);
    }
    case hikeEditPoiActions.GET_OSM_ROUTE_POIS: {
      return externalPoiListContextStateAdapter.addOne({
        id: 'osmRoute',
        loading: true
      }, state);
    }
    case hikeEditPoiActions.SET_OSM_ROUTE_POIS: {
      return externalPoiListContextStateAdapter.updateOne({
        id: 'osmRoute',
        changes: defaultChanges
      }, state);
    }
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
  contexts: poiContextReducer
};

export const hikeEditPoiReducer = combineReducers(reducerMap);

/*
export function hikeEditPoiReducer(
  state = initialState,
  action: hikeEditPoiActions.AllHikeEditPoiActions
): IHikeEditPoiState {
  switch (action.type) {
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
    case hikeEditPoiActions.SET_POI_IN_HIKE:
      return {
        ...state,
        [action.payload.subdomain]: {
          ...state[action.payload.subdomain],
          pois: state[action.payload.subdomain].pois
            .map((poi, i) => i === action.payload.poiIdx ?
            // Overwrite poi with the given poiIdx
            {
              ...state[action.payload.subdomain].pois[i],
              inHike: action.payload.isInHike
            } :
            // Leave other pois
            state[action.payload.subdomain].pois[i])
          }
      };
    default:
      return state;
  }
}
*/
