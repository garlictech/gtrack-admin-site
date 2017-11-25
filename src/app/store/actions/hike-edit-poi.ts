import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { ExternalPoi } from '../../shared/services/poi/external-poi';

@Injectable()
export class HikeEditPoiActions {
  static GET_WIKIPEDIA_POIS = '[HikeEditPoi] Get Wikipedia pois';
  static SET_WIKIPEDIA_POIS = '[HikeEditPoi] Set Wikipedia pois';
  static GET_GOOGLE_POIS = '[HikeEditPoi] Get Google pois';
  static SET_GOOGLE_POIS = '[HikeEditPoi] Set Google pois';
  static GET_OSM_NATURAL_POIS = '[HikeEditPoi] Get OSM natural pois';
  static SET_OSM_NATURAL_POIS = '[HikeEditPoi] Set OSM natural pois';
  static GET_OSM_AMENITY_POIS = '[HikeEditPoi] Get OSM amenity pois';
  static SET_OSM_AMENITY_POIS = '[HikeEditPoi] Set OSM amenity pois';
  static GET_OSM_ROUTE_POIS = '[HikeEditPoi] Get OSM route pois';
  static SET_OSM_ROUTE_POIS = '[HikeEditPoi] Set OSM route pois';
  static SET_POI_IN_HIKE = '[HikeEditPoi] Set poi inHike';
  static TOGGLE_ONROUTE_MARKERS = '[HikeEditPoi] Toggle onroute markers';
  static TOGGLE_OFFROUTE_MARKERS = '[HikeEditPoi] Toggle offroute markers';
  static MARKERS_CONFIG_CHANGED = '[HikeEditPoi] Markers config changed';

  getWikipediaPois(bounds, mapId): Action {
    return {
      type: HikeEditPoiActions.GET_WIKIPEDIA_POIS,
      payload: {
        bounds: bounds,
        mapId: mapId
      }
    };
  }

  setWikipediaPois(pois): Action {
    return {
      type: HikeEditPoiActions.SET_WIKIPEDIA_POIS,
      payload: {
        pois: pois
      }
    };
  }

  getGooglePois(bounds, mapId): Action {
    return {
      type: HikeEditPoiActions.GET_GOOGLE_POIS,
      payload: {
        bounds: bounds,
        mapId: mapId
      }
    };
  }

  setGooglePois(pois): Action {
    return {
      type: HikeEditPoiActions.SET_GOOGLE_POIS,
      payload: {
        pois: pois
      }
    };
  }

  getOsmNaturalPois(bounds, mapId): Action {
    return {
      type: HikeEditPoiActions.GET_OSM_NATURAL_POIS,
      payload: {
        bounds: bounds,
        mapId: mapId
      }
    };
  }

  setOsmNaturalPois(pois): Action {
    return {
      type: HikeEditPoiActions.SET_OSM_NATURAL_POIS,
      payload: {
        pois: pois
      }
    };
  }

  getOsmAmenityPois(bounds, mapId): Action {
    return {
      type: HikeEditPoiActions.GET_OSM_AMENITY_POIS,
      payload: {
        bounds: bounds,
        mapId: mapId
      }
    };
  }

  setOsmAmenityPois(pois): Action {
    return {
      type: HikeEditPoiActions.SET_OSM_AMENITY_POIS,
      payload: {
        pois: pois
      }
    };
  }

  getOsmRoutePois(bounds, mapId): Action {
    return {
      type: HikeEditPoiActions.GET_OSM_ROUTE_POIS,
      payload: {
        bounds: bounds,
        mapId: mapId
      }
    };
  }

  setOsmRoutePois(pois): Action {
    return {
      type: HikeEditPoiActions.SET_OSM_ROUTE_POIS,
      payload: {
        pois: pois
      }
    };
  }

  setPoiInHike(subdomain: string, poiIdx: number, isInHike: boolean): Action {
    return {
      type: HikeEditPoiActions.SET_POI_IN_HIKE,
      payload: {
        subdomain: subdomain,
        poiIdx: poiIdx,
        isInHike: isInHike
      }
    }
  }

  toggleOnrouteMarkers(subdomain: string): Action {
    return {
      type: HikeEditPoiActions.TOGGLE_ONROUTE_MARKERS,
      payload: {
        subdomain: subdomain
      }
    };
  }

  toggleOffrouteMarkers(subdomain: string): Action {
    return {
      type: HikeEditPoiActions.TOGGLE_OFFROUTE_MARKERS,
      payload: {
        subdomain: subdomain
      }
    };
  }

  markersConfigChanged(subdomain): Action {
    return {
      type: HikeEditPoiActions.MARKERS_CONFIG_CHANGED,
      payload: {
        subdomain: subdomain
      }
    };
  }
}
