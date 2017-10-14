import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../store';
import { Actions } from '../../../../subrepos/authentication-api-ngx';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'gt-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(
    private _store: Store<State>,
    private _title: Title
  ) {}

  ngOnInit() {
    this._title.setTitle('Login');
  };

  public login() {
    this._store.dispatch(new Actions.GoogleLogin(['admin']));
  }
}
