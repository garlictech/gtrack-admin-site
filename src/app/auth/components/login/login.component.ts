import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from 'app/store';
import { Observable } from 'rxjs/Observable';
import { Actions as AuthActions } from 'subrepos/authentication-api-ngx';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'gt-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loggingIn$: Observable<Boolean>;
  public loginCalled$: Observable<Boolean>;

  constructor(
    private _store: Store<State>,
    private _title: Title
  ) {}

  ngOnInit() {
    this._title.setTitle('Login');

    this.loggingIn$ = this._store.select((state: State) => state.authentication.loggingIn);
    this.loginCalled$ = this._store.select((state: State) => state.login.loginCalled);
  }

  public login() {
    this._store.dispatch(new AuthActions.GoogleLogin(['admin']));
  }
}
