import { switchMap, take } from 'rxjs/operators';

import { Component } from '@angular/core';
import { faGoogle, IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { Store } from '@ngrx/store';

import { LoginHandle } from '../../lib';
import { DebugLog } from '../../log';
import { AuthenticationActions } from '../../store';
import { AuthenticationSelectors } from '../../store/selectors';

@Component({
  selector: 'app-authentication-google-login-button',
  template: ''
})
export class GoogleLoginButtonComponent extends LoginHandle {
  icon: IconDefinition;

  constructor(store: Store<any>, selectors: AuthenticationSelectors) {
    super(store, selectors);

    this.icon = faGoogle;
  }

  @DebugLog login(e: Event): void {
    this._selectedRole$
      .pipe(
        take(1),
        switchMap(role => this._login(new AuthenticationActions.GoogleLogin([role])))
      )
      .subscribe();
  }
}
