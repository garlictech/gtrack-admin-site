import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

@Injectable()
export class HikeEditPoiActions {
  static GET_WIKIPEDIA_POIS = '[HikeEditPoi] Get Wikipedia pois';
  static SET_WIKIPEDIA_POIS = '[HikeEditPoi] Set Wikipedia pois';
  static GET_GOOGLE_POIS = '[HikeEditPoi] Get Google pois';
  static SET_GOOGLE_POIS = '[HikeEditPoi] Set Google pois';
  static GET_OSM_POIS = '[HikeEditPoi] Get OSM pois';
  static SET_OSM_POIS = '[HikeEditPoi] Set OSM pois';

  getWikipediaPois(bounds): Action {
    return {
      type: HikeEditPoiActions.GET_WIKIPEDIA_POIS,
      payload: {
        bounds: bounds
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

  getGooglePois(bounds): Action {
    return {
      type: HikeEditPoiActions.GET_GOOGLE_POIS,
      payload: {
        bounds: bounds
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

  getOsmPois(bounds, poiType): Action {
    return {
      type: HikeEditPoiActions.GET_OSM_POIS,
      payload: {
        bounds: bounds,
        poiType: poiType
      }
    };
  }

  setOsmPois(pois, poiType): Action {
    return {
      type: HikeEditPoiActions.SET_OSM_POIS,
      payload: {
        pois: pois,
        poiType: poiType
      }
    };
  }
}
