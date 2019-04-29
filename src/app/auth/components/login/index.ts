import { Observable, of } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Actions as AuthActions } from '@bit/garlictech.angular-features.common.authentication-api';
import { AuthenticationSelectors } from '@features/common/authentication';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faSpinner, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { select, Store } from '@ngrx/store';

import { State } from '../../../store';

@Component({
  selector: 'app-login',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class LoginComponent implements OnInit {
  loggingIn$: Observable<boolean>;

  faSpinner: IconDefinition;
  faGoogle: IconDefinition;

  constructor(
    private readonly _store: Store<State>,
    private readonly _title: Title,
    private readonly _authSelectors: AuthenticationSelectors.Selectors
  ) {
    this.loggingIn$ = of(false);

    this.faSpinner = faSpinner;
    this.faGoogle = faGoogle;
  }

  ngOnInit(): void {
    this._title.setTitle('gTrack Login');

    this.loggingIn$ = this._store.pipe(select(this._authSelectors.loggingIn));
  }

  login(): void {
    this._store.dispatch(new AuthActions.GoogleLogin(['admin']));
  }
}
