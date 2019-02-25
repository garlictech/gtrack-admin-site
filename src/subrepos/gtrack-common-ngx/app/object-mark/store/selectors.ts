import { Inject, Injectable } from '@angular/core';
import { EObjectMarkContext } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { Dictionary } from '@ngrx/entity/src/models';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import _find from 'lodash-es/find';
import _get from 'lodash-es/get';
import _isEqual from 'lodash-es/isEqual';
import { EXTERNAL_OBJECT_MARK_DEPENDENCIES, ExternalObjectMarkDependencies } from '../externals';
import {
  objectMarkAdapter,
  ObjectMarkContext,
  objectMarkContextAdapter,
  ObjectMarkData,
  ObjectMarkState
} from './state';

@Injectable()
export class ObjectMarkSelectors {
  selectFeature: MemoizedSelector<object, ObjectMarkState>;

  getAllObjectMarks: (state: object) => Array<ObjectMarkData>;
  getAllContexts: (state: object) => Array<ObjectMarkContext>;

  protected _selectContextEntities: (state: object) => Dictionary<ObjectMarkContext>;
  protected _selectObjectMarkEntities: (state: object) => Dictionary<ObjectMarkData>;
  protected _externals: ExternalObjectMarkDependencies;

  constructor(@Inject(EXTERNAL_OBJECT_MARK_DEPENDENCIES) externals) {
    this._externals = externals;
    this.selectFeature = createFeatureSelector<ObjectMarkState>(externals.storeDomain);

    const objectMarkSelector = createSelector(
      this.selectFeature,
      (state: ObjectMarkState) => state.objectMarks
    );
    const contextSelector = createSelector(
      this.selectFeature,
      (state: ObjectMarkState) => state.contexts
    );

    const selectors = objectMarkAdapter.getSelectors(objectMarkSelector);
    const contextSelectors = objectMarkContextAdapter.getSelectors(contextSelector);

    this.getAllObjectMarks = selectors.selectAll;
    this._selectObjectMarkEntities = selectors.selectEntities;
    this.getAllContexts = contextSelectors.selectAll;
    this._selectContextEntities = contextSelectors.selectEntities;
  }

  getObjectMarks(context: EObjectMarkContext): MemoizedSelector<object, any> {
    return createSelector(
      this.getAllObjectMarks,
      objectMarks => {
        const mark = objectMarks.find(objectMark => objectMark.id === context);

        return _get(mark, 'markedObjects', []);
      }
    );
  }

  getObjectMarkObject(context: EObjectMarkContext, objectToFind: any): MemoizedSelector<object, any> {
    return createSelector(
      this.getObjectMarks(context),
      objects => _find(objects, val => _isEqual(val, objectToFind))
    );
  }

  isObjectMarked(context: EObjectMarkContext, objectToFind: any): MemoizedSelector<object, boolean> {
    return createSelector(
      this.getObjectMarkObject(context, objectToFind),
      object => typeof object !== 'undefined'
    );
  }

  getObjectMarkContext(id: EObjectMarkContext): MemoizedSelector<object, any> {
    return createSelector(
      this.getAllContexts,
      contexts => contexts.find(context => context.id === id)
    );
  }
}
