import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EmailField, FormDescriptor } from '@bit/garlictech.angular-features.common.forms';
import { currentLanguage } from '@bit/garlictech.angular-features.common.localization/store';
import { select, Store } from '@ngrx/store';
import { combineLatest as observableCombineLatest, Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { LoginHandle } from '../../lib';
import { DebugLog } from '../../log';
import { AuthenticationActions, AuthenticationSelectors } from '../../store';

@Component({
  selector: 'app-authentication-login-box',
  template: ''
})
export class LoginBoxComponent extends LoginHandle implements OnInit {
  @Input() type: string;

  loginRefused$: Observable<boolean>;
  formDescriptor: FormDescriptor;
  termsChecked: boolean;

  constructor(store: Store<any>, authSelectors: AuthenticationSelectors.Selectors) {
    super(store, authSelectors);

    this.termsChecked = false;
  }

  ngOnInit(): void {
    this.loginRefused$ = this._store.pipe(select(this._selectors.loginRefused));

    this.formDescriptor = {
      submit: {
        translatableLabel: 'authentication.login',
        submitFv: (formGroup: FormGroup) => this._requestMagicLink(formGroup.value.email)
      },
      fields: { email: new EmailField({ label: 'authentication.magicLink', required: true }) }
    };
  }

  @DebugLog termsCheckedChanged(): void {
    this._store.dispatch(new AuthenticationActions.TermsAccepted(this.termsChecked));
  }

  @DebugLog _requestMagicLink(email: string): void {
    observableCombineLatest(
      this._store.pipe(
        select(currentLanguage),
        take(1)
      ),
      this._selectedRole$
    )
      .pipe(
        take(1),
        switchMap(values => this._login(new AuthenticationActions.RequestMagicLinkToken(email, values[0], [values[1]])))
      )
      .subscribe();
  }
}
