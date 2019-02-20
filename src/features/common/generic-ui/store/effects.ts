// tslint:disable:no-property-initializers
import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EToastSeverity, GENERIC_UI_PLATFORM_SERVICE, GenericUiPlatformServiceData } from '../interfaces';
import * as fromActions from './actions';

@Injectable()
export class Effects {
  @Effect({ dispatch: false }) showProgressSpinner$: Observable<Action> = this.actions$.pipe(
    ofType<fromActions.ShowProgressSpinner>(fromActions.ActionTypes.ShowProgressSpinner),
    tap((action: fromActions.ShowProgressSpinner) => this._ps.displayLoader(action.textLabel))
  );

  @Effect({ dispatch: false }) hideProgressSpinner$: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.ActionTypes.HideProgressSpinner),
    tap(() => this._ps.dismissLoader())
  );

  @Effect({ dispatch: false }) displayToast$: Observable<Action> = this.actions$.pipe(
    ofType<fromActions.DisplayToast>(fromActions.ActionTypes.DisplayToast),
    tap((action: fromActions.DisplayToast) =>
      this._ps.displayToast({
        severity: action.notification.severity || EToastSeverity.Success,
        summary: this._translate.instant(action.notification.summary),
        detail: action.notification.detail ? this._translate.instant(action.notification.detail) : undefined
      })
    )
  );
  constructor(
    private readonly actions$: Actions,
    @Inject(GENERIC_UI_PLATFORM_SERVICE) private readonly _ps: GenericUiPlatformServiceData,
    private readonly _translate: TranslateService
  ) {
    // EMPTY
  }
}
