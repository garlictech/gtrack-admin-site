import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../store';
import { Actions } from 'authentication-api-ngx';

@Component({
  selector: 'gt-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private _store: Store<State>) {}

  public login() {
    this._store.dispatch(new Actions.GoogleLogin(['admin']));
  }
}
