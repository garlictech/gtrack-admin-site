import { Component } from '@angular/core';
import { faFacebookF, IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { Store } from '@ngrx/store';
import { switchMap, take } from 'rxjs/operators';
import { LoginHandle } from '../../lib';
import { DebugLog } from '../../log';
import { AuthenticationActions, AuthenticationSelectors } from '../../store';

@Component({
  selector: 'app-authentication-facebook-login-button',
  template: ''
})
export class FacebookLoginButtonComponent extends LoginHandle {
  icon: IconDefinition;

  constructor(store: Store<any>, selectors: AuthenticationSelectors.Selectors) {
    super(store, selectors);

    this.icon = faFacebookF;
  }

  @DebugLog login(e: Event): void {
    this._selectedRole$
      .pipe(
        switchMap(role => this._login(new AuthenticationActions.FacebookLogin([role]))),
        take(1)
      )
      .subscribe();
  }
}
