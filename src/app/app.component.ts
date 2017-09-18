import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { State, LayoutActions, LayoutReducer } from './store';

import { Observable } from 'rxjs';

import { IAuth, Actions as AuthActions } from 'authentication-api-ngx';

import { LayoutComponent } from './core/components/layout';
import { NavItemComponent } from './core/components/nav-item';
import { SidenavComponent } from './core/components/sidenav';
import { ToolbarComponent } from './core/components/toolbar';
import { LoginComponent } from './auth/components/login';

import './styles';

@Component({
    selector: 'gtrack-main',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public showSidenav$: Observable<boolean>;
    public loggedIn$: Observable<boolean>;
    public failed$: Observable<any>;

    constructor(private store: Store<State>) {}

    ngOnInit() {
        this.showSidenav$ = this.store
            .select((state: State) => state.layout.showSidenav);

        this.loggedIn$ = this.store
            .select((state: State) => state.authentication.auth)
            .map((auth: IAuth) => auth.token !== null);

        this.failed$ = this.store
            .select((state: State) => state.authentication.failed)
            .map((err: any) => (err ? JSON.stringify(err, null, 2) : null));
    }

    closeSidenav() {
        this.store.dispatch(new LayoutActions.CloseSidenavAction());
    }

    openSidenav() {
        this.store.dispatch(new LayoutActions.OpenSidenavAction());
    }

    logout() {
        this.store.dispatch(new AuthActions.LogoutStart());
    }
}
