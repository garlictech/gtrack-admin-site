import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IEditedHikeProgramState } from '../state/edited-hike-program';
import { IPoiStored, IHikeProgramStop, IBackgroundImageData } from 'subrepos/provider-client';

import _get from 'lodash-es/get';
import _keys from 'lodash-es/keys';
import _uniq from 'lodash-es/uniq';
import _cloneDeep from 'lodash-es/cloneDeep';

const featureSelector = createFeatureSelector<IEditedHikeProgramState>('editedHikeProgram');
export const getData = createSelector(featureSelector, (state: IEditedHikeProgramState) => state.data);
export const getHikeId = createSelector(featureSelector, (state: IEditedHikeProgramState) => state.data.id);
export const getRouteId = createSelector(featureSelector, (state: IEditedHikeProgramState) => state.data.routeId);
export const getPoiIds = createSelector(featureSelector, (state: IEditedHikeProgramState) => {
  return state.data.stops.map((stop: IHikeProgramStop) => stop.poiId).filter(poiId => !!poiId);
});
export const getStops = createSelector(featureSelector, (state: IEditedHikeProgramState) => state.data.stops);
export const getStopsCount = createSelector(
  featureSelector, (state: IEditedHikeProgramState) => state.data.stops.length
);
export const getDescriptions = createSelector(featureSelector, (state: IEditedHikeProgramState) =>
  _get(state, 'data.description')
);
export const getDescriptionLangs = createSelector(featureSelector, (state: IEditedHikeProgramState) =>
  _keys(_get(state, 'data.description'))
);
export const getState = createSelector(featureSelector, (state: IEditedHikeProgramState) =>
  _get(state, 'data.state')
);
export const getBackgroundImages = createSelector(featureSelector, (state: IEditedHikeProgramState) =>
  _get(state, 'data.backgroundImages')
);
export const getDirty = createSelector(featureSelector, (state: IEditedHikeProgramState) => state.dirty);
export const getWorking = createSelector(featureSelector, (state: IEditedHikeProgramState) => state.working);
export const getError = createSelector(featureSelector, (state: IEditedHikeProgramState) => _get(state, 'failed'));

export const getDescriptionByLang = (lang: string) => {
  return createSelector(featureSelector, (state: IEditedHikeProgramState) => _get(state, `data.description.${lang}`));
};

export const getHikePois = (getAllSelector: ((state: object) => IPoiStored[])) => {
  return createSelector(getAllSelector, getPoiIds, (data, poiIds) => {
    if (typeof poiIds !== 'undefined') {
      return data.filter(item => poiIds.indexOf((<any>item).id) !== -1);
    }
  });
};

export const getHikePoisCount = (getAllSelector: ((state: object) => IPoiStored[])) => {
  return createSelector(getAllSelector, getPoiIds, (data, poiIds) => {
    if (typeof poiIds !== 'undefined') {
      return data.filter(item => poiIds.indexOf((<any>item).id) !== -1).length;
    }
  });
};

export const getStopsWithPoiNames = (getAllSelector: ((state: object) => IPoiStored[])) => {
  return createSelector(getAllSelector, getStops, (pois, stops) => {
    const _stops = _cloneDeep(stops);

    for (const stop of _stops) {
      const stopPoi = pois.find(p => p.id === stop.poiId);

      if (stopPoi) {
        (<any>stop).description = stopPoi.description;
      }
    }

    return _stops;
  });
};

export const getBackgroundOriginalUrls = () => {
  return createSelector(featureSelector, (state: IEditedHikeProgramState) => {
    return _uniq((<IBackgroundImageData[]>_get(state, 'data.backgroundImages', [])).map(img => img.original.url));
  });
};
