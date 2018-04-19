import { Injectable } from '@angular/core';
import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';

import { IEditedHikeProgramState } from '../state';
import { ILocalizedItem, ITextualDescription, IHikeProgramStored } from 'subrepos/provider-client';

import * as _ from 'lodash';

@Injectable()
export class EditedHikeProgramSelectors {
  private _featureSelector: MemoizedSelector<object, IEditedHikeProgramState>;
  public getDescriptions: MemoizedSelector<object, ILocalizedItem<ITextualDescription>>;
  public getDirty: MemoizedSelector<object, boolean>;
  public getWorking: MemoizedSelector<object, string | null>;
  public getData: MemoizedSelector<object, IHikeProgramStored>;
  public getError: MemoizedSelector<object, any>;

  public dataPath = 'editedHikeProgram.data';
  public remiteErrorDataPath = 'editedHikeProgram.failed.data';

  constructor() {
    this._featureSelector = createFeatureSelector<IEditedHikeProgramState>('editedHikeProgram');

    this.getDescriptions = createSelector(this._featureSelector,
      (state: IEditedHikeProgramState) => _.get(state, 'data.description')
    );

    this.getDirty = createSelector(this._featureSelector,
      (state: IEditedHikeProgramState) => state.dirty
    );

    this.getWorking = createSelector(this._featureSelector,
      (state: IEditedHikeProgramState) => state.working
    );

    this.getData = createSelector(this._featureSelector,
      (state: IEditedHikeProgramState) => state.data
    );

    this.getError = createSelector(this._featureSelector,
      (state: IEditedHikeProgramState) => _.get(state, 'failed.data')
    );
  }
}
