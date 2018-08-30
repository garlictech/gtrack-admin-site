import { Inject, Injectable } from '@angular/core';
import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity/src/models';

import * as _ from 'lodash';

import {
  objectMarkAdapter,
  objectMarkContextAdapter,
  IObjectMarkState,
  IObjectMarkContext,
  IObjectMarkData
} from './state';

import { EObjectMarkContext } from 'subrepos/provider-client';
import { IExternalObjectMarkDependencies, EXTERNAL_OBJECT_MARK_DEPENDENCIES } from '../externals';

@Injectable()
export class ObjectMarkSelectors {
  public selectFeature: MemoizedSelector<object, IObjectMarkState>;

  public getAllObjectMarks: (state: object) => IObjectMarkData[];
  public getAllContexts: (state: object) => IObjectMarkContext[];

  protected _selectContextEntities: (state: object) => Dictionary<IObjectMarkContext>;
  protected _selectObjectMarkEntities: (state: object) => Dictionary<IObjectMarkData>;
  protected _externals: IExternalObjectMarkDependencies;

  constructor(
    @Inject(EXTERNAL_OBJECT_MARK_DEPENDENCIES) externals,
  ) {
    this._externals = externals;
    this.selectFeature = createFeatureSelector<IObjectMarkState>(externals.storeDomain);

    let objectMarkSelector = createSelector(this.selectFeature, (state: IObjectMarkState) => state.objectMarks);
    let contextSelector = createSelector(this.selectFeature, (state: IObjectMarkState) => state.contexts);

    const selectors = objectMarkAdapter.getSelectors(objectMarkSelector);
    const contextSelectors = objectMarkContextAdapter.getSelectors(contextSelector);

    this.getAllObjectMarks = selectors.selectAll;
    this._selectObjectMarkEntities = selectors.selectEntities;
    this.getAllContexts = contextSelectors.selectAll;
    this._selectContextEntities = contextSelectors.selectEntities;
  }

  public getObjectMarks(context: EObjectMarkContext) {
    return createSelector(this.getAllObjectMarks, (objectMarks => {
      const mark = objectMarks.find(objectMark => objectMark.id === context);

      return _.get(mark, 'markedObjects', []);
    }));
  }

  public getObjectMarkObject(context: EObjectMarkContext, objectToFind: any) {
    return createSelector(this.getObjectMarks(context), objects => {
      return _.find(objects, val => _.isEqual(val, objectToFind));
    });
  }

  public isObjectMarked(context: EObjectMarkContext, objectToFind: any) {
    return createSelector(this.getObjectMarkObject(context, objectToFind), object => {
      return (typeof object !== 'undefined');
    });
  }

  public getObjectMarkContext(id: EObjectMarkContext) {
    return createSelector(this.getAllContexts, contexts => {
      return contexts.find(context => context.id === id);
    });
  }
}
