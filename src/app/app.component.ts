import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { go } from '@ngrx/router-store';
import { Observable, Subscription } from 'rxjs';

import { IAuth } from 'authentication-api-ngx';
import { State } from './store';

import './styles';

@Component({
    selector: 'gtrack-main',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    private _authSubscription: Subscription;

    constructor(private _store: Store<State>) {}

    ngOnInit() {
        this._authSubscription = this._store
            .select((state: State) => state.authentication.auth)
            .filter((auth: IAuth) => auth.token === null)
            .subscribe((auth: IAuth) => {
                this._store.dispatch(go(['/login']));
            });
    }

    ngOnDestroy() {
        this._authSubscription.unsubscribe();
    }
}
