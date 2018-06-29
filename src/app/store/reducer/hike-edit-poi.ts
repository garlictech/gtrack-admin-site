import { Action, ActionReducer, ActionReducerMap, combineReducers } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import {
  IHikeEditPoiState, IWikipediaPoiEntityState, IGooglePoiEntityState, IOsmAmenityPoiEntityState,
  IOsmNaturalPoiEntityState, IOsmRoutePoiEntityState, IExternalPoiListContextState, IGTrackPoiMergeState
} from '../state';
import { IWikipediaPoi, IGooglePoi, IOsmPoi } from 'app/shared/interfaces';
import { hikeEditPoiActions } from '../index';
import { poiReducer } from 'subrepos/gtrack-common-ngx';

import * as _ from 'lodash';

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

    case hikeEditPoiActions.RESET_POI_STATE: {
      return googlePoiInitialState;
    }

    case hikeEditPoiActions.SET_GOOGLE_POIS: {
      return googlePoiAdapter.addAll(action.pois, state);
    }

    case hikeEditPoiActions.SET_GOOGLE_POIS_IN_GTRACK_DB: {
      return googlePoiAdapter.updateMany(action.properties.map(poi => {
        return {
          id: poi.id,
          changes: _.omit(poi, ['id'])
        };
      }), state);
    }

    case hikeEditPoiActions.SET_GOOGLE_POI_IN_HIKE:
      return googlePoiAdapter.updateOne({
        id: action.poiId,
        changes: {
          inHike: action.isInHike
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

    case hikeEditPoiActions.RESET_POI_STATE: {
      return osmAmenityPoiInitialState;
    }

    case hikeEditPoiActions.SET_OSM_AMENITY_POIS: {
      return osmAmenityPoiAdapter.addAll(action.pois, state);
    }

    case hikeEditPoiActions.SET_OSM_AMENITY_POIS_IN_GTRACK_DB: {
      return osmAmenityPoiAdapter.updateMany(action.properties.map(poi => {
        return {
          id: poi.id,
          changes: _.omit(poi, ['id'])
        };
      }), state);
    }

    case hikeEditPoiActions.SET_OSM_AMENITY_POI_IN_HIKE:
      return osmAmenityPoiAdapter.updateOne({
        id: action.poiId,
        changes: {
          inHike: action.isInHike
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

    case hikeEditPoiActions.RESET_POI_STATE: {
      return osmNaturalPoiInitialState;
    }

    case hikeEditPoiActions.SET_OSM_NATURAL_POIS: {
      return osmNaturalPoiAdapter.addAll(action.pois, state);
    }

    case hikeEditPoiActions.SET_OSM_NATURAL_POIS_IN_GTRACK_DB: {
      return osmNaturalPoiAdapter.updateMany(action.properties.map(poi => {
        return {
          id: poi.id,
          changes: _.omit(poi, ['id'])
        };
      }), state);
    }

    case hikeEditPoiActions.SET_OSM_NATURAL_POI_IN_HIKE:
      return osmNaturalPoiAdapter.updateOne({
        id: action.poiId,
        changes: {
          inHike: action.isInHike
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

    case hikeEditPoiActions.RESET_POI_STATE: {
      return osmRoutePoiInitialState;
    }

    case hikeEditPoiActions.SET_OSM_ROUTE_POIS: {
      return osmRoutePoiAdapter.addAll(action.pois, state);
    }

    case hikeEditPoiActions.SET_OSM_ROUTE_POIS_IN_GTRACK_DB: {
      return osmRoutePoiAdapter.updateMany(action.properties.map(poi => {
        return {
          id: poi.id,
          changes: _.omit(poi, ['id'])
        };
      }), state);
    }

    case hikeEditPoiActions.SET_OSM_ROUTE_POI_IN_HIKE:
      return osmRoutePoiAdapter.updateOne({
        id: action.poiId,
        changes: {
          inHike: action.isInHike
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

    case hikeEditPoiActions.RESET_POI_STATE: {
      return wikipediaPoiInitialState;
    }

    case hikeEditPoiActions.SET_WIKIPEDIA_POIS: {
      return wikipediaPoiAdapter.addAll(action.pois, state);
    }

    case hikeEditPoiActions.SET_WIKIPEDIA_POIS_IN_GTRACK_DB: {
      return wikipediaPoiAdapter.updateMany(action.properties.map(poi => {
        return {
          id: poi.id,
          changes: _.omit(poi, ['id'])
        };
      }), state);
    }

    case hikeEditPoiActions.SET_WIKIPEDIA_POI_IN_HIKE:
      return wikipediaPoiAdapter.updateOne({
        id: action.poiId,
        changes: {
          inHike: action.isInHike
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
  loaded: false,
  saving: false,
  showOnrouteMarkers: true,
  showOffrouteMarkers: false
};

export const externalPoiInitialContextState: IExternalPoiListContextState = {
  google: _.cloneDeep(initialContextItemState),
  osmAmenity: _.cloneDeep(initialContextItemState),
  osmNatural: _.cloneDeep(initialContextItemState),
  osmRoute: _.cloneDeep(initialContextItemState),
  wikipedia: _.cloneDeep(initialContextItemState),
  gTrack: _.merge(_.cloneDeep(initialContextItemState), {
    showOnrouteMarkers: false,
  }),
  hike: _.merge(_.cloneDeep(initialContextItemState), {
    showOffrouteMarkers: true
  })
};

export function externalPoiListContextReducer(
  state = externalPoiInitialContextState,
  action: hikeEditPoiActions.AllHikeEditPoiActions
): IExternalPoiListContextState {
  switch (action.type) {

    case hikeEditPoiActions.RESET_POI_STATE:
      return externalPoiInitialContextState;

    /**
     * Wikipedia
     */
    case hikeEditPoiActions.GET_WIKIPEDIA_POIS: {
      return {
        ...state,
        wikipedia: {
          ...state.wikipedia,
          loading: true,
          loaded: false
        }
      };
    }

    case hikeEditPoiActions.SET_WIKIPEDIA_POIS: {
      return {
        ...state,
        wikipedia: {
          ...state.wikipedia,
          loading: false,
          loaded: true
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
          loading: true,
          loaded: false
        }
      };
    }

    case hikeEditPoiActions.SET_GOOGLE_POIS: {
      return {
        ...state,
        google: {
          ...state.google,
          loading: false,
          loaded: true
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
          loading: true,
          loaded: false
        }
      };
    }

    case hikeEditPoiActions.SET_OSM_AMENITY_POIS: {
      return {
        ...state,
        osmAmenity: {
          ...state.osmAmenity,
          loading: false,
          loaded: true
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
          loading: true,
          loaded: false
        }
      };
    }

    case hikeEditPoiActions.SET_OSM_NATURAL_POIS: {
      return {
        ...state,
        osmNatural: {
          ...state.osmNatural,
          loading: false,
          loaded: true
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
          loading: true,
          loaded: false
        }
      };
    }

    case hikeEditPoiActions.SET_OSM_ROUTE_POIS: {
      return {
        ...state,
        osmRoute: {
          ...state.osmRoute,
          loading: false,
          loaded: true
        }
      };
    }

    /**
     * Toggle markers
     */

    case hikeEditPoiActions.TOGGLE_ONROUTE_MARKERS:
      return {
        ...state,
        [action.subdomain]: {
          ...state[action.subdomain],
          showOnrouteMarkers: !state[action.subdomain].showOnrouteMarkers
        }
      };

    case hikeEditPoiActions.TOGGLE_OFFROUTE_MARKERS:
      return {
        ...state,
        [action.subdomain]: {
          ...state[action.subdomain],
          showOffrouteMarkers: !state[action.subdomain].showOffrouteMarkers
        }
      };

    /**
     * Loading
     */

    case hikeEditPoiActions.SET_LOADING:
      return {
        ...state,
        [action.subdomain]: {
          ...state[action.subdomain],
          loading: true,
          loaded: false
        }
      };

    /**
     * Saving
     */

    case hikeEditPoiActions.SET_SAVING:
      return {
        ...state,
        [action.subdomain]: {
          ...state[action.subdomain],
          saving: action.saving
        }
      };

    default:
      return state;

  }
}

/**
 * Merge pois
 */

export const initialGTrackPoiMergeState = {
  selections: []
};

 // export function hikeEditRoutePlannerReducer(
export const gTrackPoiMergeReducer: ActionReducer<IGTrackPoiMergeState> = (
  state = initialGTrackPoiMergeState,
  action: hikeEditPoiActions.AllHikeEditPoiActions
): IGTrackPoiMergeState => {
  switch (action.type) {

    case hikeEditPoiActions.RESET_POI_STATE:
      return initialGTrackPoiMergeState;

    case hikeEditPoiActions.RESET_POI_MERGE_SELECTION:
      return initialGTrackPoiMergeState;

    case hikeEditPoiActions.ADD_GTRACK_POI_TO_MERGE_SELECTION:
      return {
        ...state,
        selections: [
          ...state.selections,
          action.poiId
        ]
      };

    case hikeEditPoiActions.REMOVE_GTRACK_POI_FROM_MERGE_SELECTION:
      return {
        ...state,
        selections: state.selections.filter(s => s !== action.poiId)
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
  contexts: externalPoiListContextReducer,
  gTrackPoiMerge: gTrackPoiMergeReducer
};

export const hikeEditPoiReducer = combineReducers(reducerMap);
