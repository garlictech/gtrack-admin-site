import { Component, ViewEncapsulation } from '@angular/core';

import { Store } from '@ngrx/store';
import { State } from '../../../store';
import { IAuth, Actions } from 'authentication-api-ngx';

@Component({
    selector: 'gt-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LoginComponent {

    constructor(private store: Store<State>) {}

    public login() {
        console.log('login');
        this.store.dispatch(new Actions.GoogleLogin(['admin']));
    }
}
