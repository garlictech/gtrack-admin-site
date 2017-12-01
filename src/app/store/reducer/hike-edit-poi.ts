import { ActionReducer, Action } from '@ngrx/store';
import { IHikeEditPoiState } from '../state';
import { hikeEditPoiActions } from '../index';

const initialState: IHikeEditPoiState = {
  wikipedia: {
    pois: [],
    loading: false,
    showOnrouteMarkers: true,
    showOffrouteMarkers: false
  },
  google: {
    pois: [],
    loading: false,
    showOnrouteMarkers: true,
    showOffrouteMarkers: false
  },
  osmNatural: {
    pois: [],
    loading: false,
    showOnrouteMarkers: true,
    showOffrouteMarkers: false
  },
  osmAmenity: {
    pois: [],
    loading: false,
    showOnrouteMarkers: true,
    showOffrouteMarkers: false
  },
  osmRoute: {
    pois: [],
    loading: false,
    showOnrouteMarkers: true,
    showOffrouteMarkers: false
  }
};

export function hikeEditPoiReducer(
  state = initialState,
  action: hikeEditPoiActions.AllHikeEditPoiActions
): IHikeEditPoiState {
  switch (action.type) {
    case hikeEditPoiActions.GET_WIKIPEDIA_POIS:
      return {
        ...state,
        wikipedia: {
          ...state.wikipedia,
          loading: true
        }
      };
    case hikeEditPoiActions.SET_WIKIPEDIA_POIS:
      return {
        ...state,
        wikipedia: {
          ...state.wikipedia,
          pois: action.payload.pois,
          loading: false
        }
      };
    case hikeEditPoiActions.GET_GOOGLE_POIS:
      return {
        ...state,
        google: {
          ...state.google,
          loading: true
        }
      };
    case hikeEditPoiActions.SET_GOOGLE_POIS:
      return {
        ...state,
        google: {
          ...state.google,
          pois: action.payload.pois,
          loading: false
        }
      };
    case hikeEditPoiActions.GET_OSM_NATURAL_POIS:
      return {
        ...state,
        osmNatural: {
          ...state.osmNatural,
          loading: true
        }
      };
    case hikeEditPoiActions.SET_OSM_NATURAL_POIS:
      return {
        ...state,
        osmNatural: {
          ...state.osmNatural,
          pois: action.payload.pois,
          loading: false
        }
      };
    case hikeEditPoiActions.GET_OSM_AMENITY_POIS:
      return {
        ...state,
        osmAmenity: {
          ...state.osmAmenity,
          loading: true
        }
      };
    case hikeEditPoiActions.SET_OSM_AMENITY_POIS:
      return {
        ...state,
        osmAmenity: {
          ...state.osmAmenity,
          pois: action.payload.pois,
          loading: false
        }
      };
    case hikeEditPoiActions.GET_OSM_ROUTE_POIS:
      return {
        ...state,
        osmRoute: {
          ...state.osmRoute,
          loading: true
        }
      };
    case hikeEditPoiActions.SET_OSM_ROUTE_POIS:
      return {
        ...state,
        osmRoute: {
          ...state.osmRoute,
          pois: action.payload.pois,
          loading: false
        }
      };
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
