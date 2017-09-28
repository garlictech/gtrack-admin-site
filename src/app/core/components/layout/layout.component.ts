import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { go } from '@ngrx/router-store';
import { Observable, Subscription } from 'rxjs';
import { IAuth, Actions as AuthActions } from 'authentication-api-ngx';
import { State, GtActions } from '../../../store';

@Component({
    selector: 'gt-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    private _authSubscription: Subscription;
    public showSidenav$: Observable<boolean>;
    public loggedIn$: Observable<boolean>;
    public failed$: Observable<any>;

    constructor(private _store: Store<State>) {}

    ngOnInit() {
        //
    }

    logout() {
        this._store.dispatch(new AuthActions.LogoutStart());
        this._store.dispatch(new GtActions.CloseSidenavAction());
    }
}
