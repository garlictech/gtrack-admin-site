import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Store } from '@ngrx/store';
import { State } from '../../store';
import { IAuth, Actions } from 'authentication-api-ngx';

import { Observable } from 'rxjs';

@Component({
    selector: 'gt-home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
    public auth$: Observable<string>;

    constructor(private store: Store<State>) {}

    ngOnInit() {
        this.auth$ = this.store
            .select((state: State) => state.authentication.auth)
            .filter((auth: IAuth) => auth !== null)
            .map((auth: IAuth) => {
                return JSON.stringify(auth, null, 2);
            });
    }
}
