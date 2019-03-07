// tslint:disable:no-property-initializers
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { Observable } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';

import { ObjectMarkService } from '../services';
import * as LocalActions from './actions';

@Injectable()
export class ObjectMarkEffects {
  @Effect() loadContext$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.LoadContext>(LocalActions.ObjectMarkActionTypes.LOAD_CONTEXT),
    mergeMap(action =>
      this._objectMark.loadContext(action.context).pipe(
        take(1),
        map((objects: Array<any>) => new LocalActions.ContextLoaded(action.context, objects))
      )
    )
  );

  @Effect() markObject$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.MarkObject>(LocalActions.ObjectMarkActionTypes.MARK_OBJECT),
    mergeMap(action =>
      this._objectMark.mark(action.context, action.object, action.mark).pipe(
        take(1),
        map(() => new LocalActions.ObjectMarked(action.context, action.object, action.mark))
      )
    )
  );

  constructor(private readonly _actions$: Actions, private readonly _objectMark: ObjectMarkService) {}
}
