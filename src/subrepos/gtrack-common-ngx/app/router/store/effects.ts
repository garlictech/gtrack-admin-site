import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action } from '@ngrx/store';
import { Location } from '@angular/common';
import { Effect, Actions } from '@ngrx/effects';
import * as RouterActions from './actions';
import { Observable } from 'rxjs';

@Injectable()
export class Effects {
  @Effect({ dispatch: false })
  navigateGo$: Observable<Action> = this.actions$
    .ofType(RouterActions.GO)
    .do((action: RouterActions.Go) => this.router.navigate(action.path, action.extras));

  @Effect({ dispatch: false })
  navigateReplace$: Observable<Action> = this.actions$
    .ofType(RouterActions.REPLACE)
    .do((action: RouterActions.Replace) => this.router.navigate(action.path, action.extras));

  @Effect({ dispatch: false })
  navigateBack$ = this.actions$.ofType(RouterActions.BACK).do(() => this.location.back());

  @Effect({ dispatch: false })
  navigateForward$ = this.actions$.ofType(RouterActions.FORWARD).do(() => this.location.forward());

  constructor(private actions$: Actions, private router: Router, private location: Location) {}
}
