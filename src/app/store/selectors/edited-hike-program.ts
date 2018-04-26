import { Injectable } from '@angular/core';
import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';

import { IEditedHikeProgramState } from '../state/edited-hike-program';
import { ILocalizedItem, ITextualDescription, IHikeProgramStored, IPoiStored, IHikeProgramStop } from 'subrepos/provider-client';

import * as _ from 'lodash';

@Injectable()
export class EditedHikeProgramSelectors {
  private _featureSelector: MemoizedSelector<object, IEditedHikeProgramState>;
  public getDescriptions: MemoizedSelector<object, ILocalizedItem<ITextualDescription>>;
  public getHikeId: MemoizedSelector<object, string>;
  public getRouteId: MemoizedSelector<object, string>;
  public getPoiIds: MemoizedSelector<object, string[]>;
  public getStops: MemoizedSelector<object, IHikeProgramStop[]>;
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

    this.getDescriptions = createSelector(this._featureSelector,
      (state: IEditedHikeProgramState) => _.get(state, 'data.description')
    );

    this.getDirty = createSelector(this._featureSelector,
      (state: IEditedHikeProgramState) => state.dirty
    );

    this.getWorking = createSelector(this._featureSelector,
      (state: IEditedHikeProgramState) => state.working
    );

    this.getError = createSelector(this._featureSelector,
      (state: IEditedHikeProgramState) => _.get(state, 'failed.data')
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

}
