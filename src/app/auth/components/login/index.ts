import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from '../../../store';
import { Observable } from 'rxjs';
import { Actions as AuthActions } from 'subrepos/authentication-api-ngx';
import { Title } from '@angular/platform-browser';
import { AuthenticationSelectors } from 'subrepos/gtrack-common-ngx';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class LoginComponent implements OnInit {
  public loggingIn$: Observable<Boolean>;
  public faSpinner = faSpinner;
  public faGoogle = faGoogle;

  constructor(
    private _store: Store<State>,
    private _title: Title,
    private _authSelectors: AuthenticationSelectors.Selectors
  ) {}

  ngOnInit() {
    this._title.setTitle('gTrack Login');

    this.loggingIn$ = this._store.pipe(select(this._authSelectors.loggingIn));
  }

  public login() {
    this._store.dispatch(new AuthActions.GoogleLogin(['admin']));
  }
}
