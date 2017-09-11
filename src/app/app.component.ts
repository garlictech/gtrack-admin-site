import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { State } from './store';

import { Observable } from 'rxjs';
import { IAuth, Actions } from 'authentication-api-ngx';

@Component({
  selector: 'gtrack-main',
  templateUrl: './app.component.pug',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public auth$: Observable<string>;
  public loggedIn$: Observable<boolean>;
  public failed$: Observable<any>;

  constructor(private store: Store<State>) {}

  ngOnInit() {
    this.auth$ = this.store
      .select((state: State) => state.authentication.auth)
      .filter((auth: IAuth) => auth !== null)
      .map((auth: IAuth) => {
        return JSON.stringify(auth, null, 2);
      });

    this.loggedIn$ = this.store
      .select((state: State) => state.authentication.auth)
      .map((auth: IAuth) => auth.token !== null);

    this.failed$ = this.store
      .select((state: State) => state.authentication.failed)
      .map((err: any) => (err ? JSON.stringify(err, null, 2) : null));
  }

  logout() {
    this.store.dispatch(new Actions.LogoutStart());
  }
  public login() {
    this.store.dispatch(new Actions.GoogleLogin(['admin']));
  }
}
