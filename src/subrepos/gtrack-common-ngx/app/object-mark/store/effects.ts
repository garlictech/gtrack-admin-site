import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { mergeMap, map, delay, take } from 'rxjs/operators';

import * as LocalActions from './actions';
import { ObjectMarkService } from '../services';

@Injectable()
export class ObjectMarkEffects {
  @Effect()
  public loadContext$: Observable<Action> = this._actions$
    .ofType<LocalActions.LoadContext>(LocalActions.ObjectMarkActionTypes.LOAD_CONTEXT)
    .pipe(
      mergeMap(action => {
        return this._objectMark.loadContext(action.context).pipe(
          take(1),
          map(objects => new LocalActions.ContextLoaded(action.context, objects))
        );
      })
    );

  @Effect()
  public markObject$: Observable<Action> = this._actions$
    .ofType<LocalActions.MarkObject>(LocalActions.ObjectMarkActionTypes.MARK_OBJECT)
    .pipe(
      mergeMap(action => {
        return this._objectMark.mark(action.context, action.object, action.mark).pipe(
          take(1),
          map(() => new LocalActions.ObjectMarked(action.context, action.object, action.mark))
        );
      })
    );

  constructor(private _actions$: Actions, private _store: Store<any>, private _objectMark: ObjectMarkService) {}
}
