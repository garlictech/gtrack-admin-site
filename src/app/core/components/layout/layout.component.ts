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
        this.showSidenav$ = this._store
            .select((state: State) => state.layout.showSidenav);
    }

    closeSidenav() {
        this._store.dispatch(new GtActions.CloseSidenavAction());
    }

    openSidenav() {
        this._store.dispatch(new GtActions.OpenSidenavAction());
    }

    handleSidenav() {
        this.showSidenav$.take(1).subscribe(show => {
            if (show) {
                this._store.dispatch(new GtActions.CloseSidenavAction());
            } else {
                this._store.dispatch(new GtActions.OpenSidenavAction());
            }
        });
    }

    logout() {
        this._store.dispatch(new AuthActions.LogoutStart());
        this._store.dispatch(new GtActions.CloseSidenavAction());
    }
}
