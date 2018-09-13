import { Injectable } from '@angular/core';
import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';
import { IEditedHikeProgramState } from '../state/edited-hike-program';
import {
  ILocalizedItem, ITextualDescription, IHikeProgramStored, IPoiStored, IHikeProgramStop, EObjectState, IBackgroundImageData
} from 'subrepos/provider-client';

import _get from 'lodash-es/get';
import _keys from 'lodash-es/keys';
import _uniq from 'lodash-es/uniq';
import _cloneDeep from 'lodash-es/cloneDeep';

@Injectable()
export class EditedHikeProgramSelectors {
  private _featureSelector: MemoizedSelector<object, IEditedHikeProgramState>;
  public getDescriptions: MemoizedSelector<object, ILocalizedItem<ITextualDescription>>;
  public getDescriptionLangs: MemoizedSelector<object, string[]>;
  public getHikeId: MemoizedSelector<object, string>;
  public getRouteId: MemoizedSelector<object, string>;
  public getPoiIds: MemoizedSelector<object, string[]>;
  public getStops: MemoizedSelector<object, IHikeProgramStop[]>;
  public getStopsCount: MemoizedSelector<object, number>;
  public getState: MemoizedSelector<object, EObjectState>;
  public getBackgroundImages: MemoizedSelector<object, IBackgroundImageData[]>;
  public getDirty: MemoizedSelector<object, boolean>;
  public getWorking: MemoizedSelector<object, string | null>;
  public getData: MemoizedSelector<object, IHikeProgramStored>;
  public getError: MemoizedSelector<object, any>;

  public dataPath = 'editedHikeProgram.data';
  public remiteErrorDataPath = 'editedHikeProgram.failed.data';

  constructor() {
    this._featureSelector = createFeatureSelector<IEditedHikeProgramState>('editedHikeProgram');

    this.getData = createSelector(this._featureSelector,
      (state: IEditedHikeProgramState) => state.data
    );

    this.getHikeId = createSelector(this._featureSelector,
      (state: IEditedHikeProgramState) => state.data.id
    );

    this.getRouteId = createSelector(this._featureSelector,
      (state: IEditedHikeProgramState) => state.data.routeId
    );

    this.getPoiIds = createSelector(this._featureSelector,
      (state: IEditedHikeProgramState) => {
        return state.data.stops.map((stop: IHikeProgramStop) => stop.poiId).filter(poiId => !!poiId);
      }
    );

    this.getStops = createSelector(this._featureSelector,
      (state: IEditedHikeProgramState) => state.data.stops
    );

    this.getStopsCount = createSelector(this._featureSelector,
      (state: IEditedHikeProgramState) => state.data.stops.length
    );

    this.getDescriptions = createSelector(this._featureSelector,
      (state: IEditedHikeProgramState) => _get(state, 'data.description')
    );

    this.getDescriptionLangs = createSelector(this._featureSelector,
      (state: IEditedHikeProgramState) => _keys(_get(state, 'data.description'))
    );

    this.getState = createSelector(this._featureSelector,
      (state: IEditedHikeProgramState) => _get(state, 'data.state')
    );

    this.getBackgroundImages = createSelector(this._featureSelector,
      (state: IEditedHikeProgramState) => _get(state, 'data.backgroundImages')
    );

    this.getDirty = createSelector(this._featureSelector,
      (state: IEditedHikeProgramState) => state.dirty
    );

    this.getWorking = createSelector(this._featureSelector,
      (state: IEditedHikeProgramState) => state.working
    );

    this.getError = createSelector(this._featureSelector,
      (state: IEditedHikeProgramState) => _get(state, 'failed.data')
    );
  }

  public getHikePois<IPoi>(getAllSelector: ((state: object) => IPoiStored[])) {
    return createSelector(
      getAllSelector,
      this.getPoiIds,
      (data, poiIds) => {
        if (typeof poiIds !== 'undefined') {
          return data.filter(item => poiIds.indexOf((<any>item).id) !== -1);
        }
      }
    )
  }

  public getHikePoisCount<IPoi>(getAllSelector: ((state: object) => IPoiStored[])) {
    return createSelector(
      getAllSelector,
      this.getPoiIds,
      (data, poiIds) => {
        if (typeof poiIds !== 'undefined') {
          return data.filter(item => poiIds.indexOf((<any>item).id) !== -1).length;
        }
      }
    )
  }

  public getStopsWithPoiNames<IPoi>(getAllSelector: ((state: object) => IPoiStored[])) {
    return createSelector(
      getAllSelector,
      this.getStops,
      (pois, stops) => {
        const _stops = _cloneDeep(stops);

        for (let stop of _stops) {
          const stopPoi = pois.find(p => p.id === stop.poiId);

          if (stopPoi) {
            (<any>stop).description = stopPoi.description;
          }
        }

        return _stops;
      }
    )
  }

  public getBackgroundOriginalUrls() {
    return createSelector(this._featureSelector, (state: IEditedHikeProgramState) => {
      return _uniq((<IBackgroundImageData[]>state.data.backgroundImages || []).map((img: IBackgroundImageData) => img.original.url));
    });
  }
}
