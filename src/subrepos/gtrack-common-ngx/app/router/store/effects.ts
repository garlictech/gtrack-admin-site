// tslint:disable:no-property-initializers
import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as RouterActions from './actions';

@Injectable()
export class Effects {
  @Effect({ dispatch: false }) navigateGo$: Observable<Action> = this.actions$.pipe(
    ofType(RouterActions.GO),
    tap(async (action: RouterActions.Go) => {
      await this.router.navigate(action.path, action.extras);
    })
  );

  @Effect({ dispatch: false }) navigateReplace$: Observable<Action> = this.actions$.pipe(
    ofType(RouterActions.REPLACE),
    tap(async (action: RouterActions.Replace) => {
      await this.router.navigate(action.path, action.extras);
    })
  );

  @Effect({ dispatch: false }) navigateBack$ = this.actions$.pipe(
    ofType(RouterActions.BACK),
    tap(() => this.location.back())
  );

  @Effect({ dispatch: false }) navigateForward$ = this.actions$.pipe(
    ofType(RouterActions.FORWARD),
    tap(() => this.location.forward())
  );

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly location: Location
  ) {}
}
