import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { Observable } from 'rxjs';
import { mergeMap, map, take } from 'rxjs/operators';

import * as LocalActions from './actions';
import { ObjectMarkService } from '../services';

@Injectable()
export class ObjectMarkEffects {
  @Effect()
  public loadContext$: Observable<Action> = this._actions$
    .pipe(
      ofType<LocalActions.LoadContext>(LocalActions.ObjectMarkActionTypes.LOAD_CONTEXT),
      mergeMap(action => {
        return this._objectMark.loadContext(action.context).pipe(
          take(1),
          map(objects => new LocalActions.ContextLoaded(action.context, objects))
        );
      })
    );

  @Effect()
  public markObject$: Observable<Action> = this._actions$
    .pipe(
      ofType<LocalActions.MarkObject>(LocalActions.ObjectMarkActionTypes.MARK_OBJECT),
      mergeMap(action => {
        return this._objectMark.mark(action.context, action.object, action.mark).pipe(
          take(1),
          map(() => new LocalActions.ObjectMarked(action.context, action.object, action.mark))
        );
      })
    );

  constructor(private _actions$: Actions, private _objectMark: ObjectMarkService) {}
}
