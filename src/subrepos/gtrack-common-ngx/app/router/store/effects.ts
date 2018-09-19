import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action } from '@ngrx/store';
import { Location } from '@angular/common';
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as RouterActions from './actions';
import { Observable } from 'rxjs';

@Injectable()
export class Effects {
  @Effect({ dispatch: false })
  navigateGo$: Observable<Action> = this.actions$.pipe(
    ofType(RouterActions.GO),
    tap((action: RouterActions.Go) => this.router.navigate(action.path, action.extras))
  );

  @Effect({ dispatch: false })
  navigateReplace$: Observable<Action> = this.actions$.pipe(
    ofType(RouterActions.REPLACE),
    tap((action: RouterActions.Replace) => this.router.navigate(action.path, action.extras))
  );

  @Effect({ dispatch: false })
  navigateBack$ = this.actions$.pipe(
    ofType(RouterActions.BACK),
    tap(() => this.location.back())
  );

  @Effect({ dispatch: false })
  navigateForward$ = this.actions$.pipe(
    ofType(RouterActions.FORWARD),
    tap(() => this.location.forward())
  );

  constructor(private actions$: Actions, private router: Router, private location: Location) {}
}
