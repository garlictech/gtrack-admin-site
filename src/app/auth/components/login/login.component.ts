import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../../../store';
import { IAuth, Actions } from 'authentication-api-ngx';
import { go } from '@ngrx/router-store';

@Component({
    selector: 'gt-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    public loggedIn$: Observable<boolean>;

    constructor(private _store: Store<State>) {}

    ngOnInit() {
        this._store
            .select((state: State) => state.authentication.auth)
            .filter((auth: IAuth) => auth.token !== null)
            .take(1)
            .subscribe((auth: IAuth) => {
                this._store.dispatch(go(['/']));
            });
    }

    public login() {
        this._store.dispatch(new Actions.GoogleLogin(['admin']));
    }
}
