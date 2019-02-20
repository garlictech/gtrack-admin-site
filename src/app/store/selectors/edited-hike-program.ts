import _cloneDeep from 'lodash-es/cloneDeep';
import _get from 'lodash-es/get';
import _keys from 'lodash-es/keys';
import _uniq from 'lodash-es/uniq';
import { BackgroundImageData, HikeProgramStop, IPoiStored } from 'subrepos/provider-client';

import { createFeatureSelector, createSelector } from '@ngrx/store';

import { EditedHikeProgramState } from '../state/edited-hike-program';

const featureSelector = createFeatureSelector<EditedHikeProgramState>('editedHikeProgram');
export const getData = createSelector(
  featureSelector,
  (state: EditedHikeProgramState) => state.data
);
export const getHikeId = createSelector(
  featureSelector,
  (state: EditedHikeProgramState) => state.data.id
);
export const getRouteId = createSelector(
  featureSelector,
  (state: EditedHikeProgramState) => state.data.routeId
);
export const getPoiIds = createSelector(
  featureSelector,
  (state: EditedHikeProgramState) =>
    state.data.stops.map((stop: HikeProgramStop) => stop.poiId).filter(poiId => !!poiId)
);
export const getStops = createSelector(
  featureSelector,
  (state: EditedHikeProgramState) => state.data.stops
);
export const getStopsCount = createSelector(
  featureSelector,
  (state: EditedHikeProgramState) => state.data.stops.length
);
export const getDescriptions = createSelector(
  featureSelector,
  (state: EditedHikeProgramState) => _get(state, 'data.description')
);
export const getDescriptionLangs = createSelector(
  featureSelector,
  (state: EditedHikeProgramState) => _keys(_get(state, 'data.description'))
);
export const getState = createSelector(
  featureSelector,
  (state: EditedHikeProgramState) => _get(state, 'data.state')
);
export const getBackgroundImages = createSelector(
  featureSelector,
  (state: EditedHikeProgramState) => _get(state, 'data.backgroundImages')
);
export const getDirty = createSelector(
  featureSelector,
  (state: EditedHikeProgramState) => state.dirty
);
export const getWorking = createSelector(
  featureSelector,
  (state: EditedHikeProgramState) => state.working
);
export const getError = createSelector(
  featureSelector,
  (state: EditedHikeProgramState) => _get(state, 'failed')
);

export const getDescriptionByLang = (lang: string) =>
  createSelector(
    featureSelector,
    (state: EditedHikeProgramState) => _get(state, `data.description.${lang}`)
  );

export const getHikePois = (getAllSelector: (state: object) => Array<IPoiStored>) =>
  createSelector(
    getAllSelector,
    getPoiIds,
    (data, poiIds) => {
      if (typeof poiIds !== 'undefined') {
        return data.filter(item => poiIds.indexOf((item as any).id) !== -1);
      }
    }
  );

export const getHikePoisCount = (getAllSelector: (state: object) => Array<IPoiStored>) =>
  createSelector(
    getAllSelector,
    getPoiIds,
    (data, poiIds) => {
      if (typeof poiIds !== 'undefined') {
        return data.filter(item => poiIds.indexOf((item as any).id) !== -1).length;
      }
    }
  );

export const getStopsWithPoiNames = (getAllSelector: (state: object) => Array<IPoiStored>) =>
  createSelector(
    getAllSelector,
    getStops,
    (pois, stops) => {
      const _stops = _cloneDeep(stops);

      for (const stop of _stops) {
        const stopPoi = pois.find(p => p.id === stop.poiId);

        if (stopPoi) {
          (stop as any).description = stopPoi.description;
        }
      }

      return _stops;
    }
  );

export const getBackgroundOriginalUrls = () =>
  createSelector(
    featureSelector,
    (state: EditedHikeProgramState) =>
      _uniq((_get(state, 'data.backgroundImages', []) as Array<BackgroundImageData>).map(img => img.original.url))
  );
