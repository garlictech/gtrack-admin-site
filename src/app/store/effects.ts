import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class Effects {
    constructor(
        private _actions$: Actions
    ) {}

    // Logout
    /*
    @Effect()
    logout$: Observable<Action> = this._actions$
        .ofType(AuthActions.LOGOUT_SUCCESS)
        .map(toPayload)
        .switchMap(() => {
            return Observable.fromPromise(this._auth.logout())
                .map(() => {
                    log.i('Effect: Logout success');
                    return new LocalActions.LogoutSuccess();
                })
                .catch(err => {
                log.er('Effect: Logout error', err);
                return Observable.of(new LocalActions.FailureHappened(err));
                });
            });
        });
    */
}
