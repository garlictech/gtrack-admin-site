import { NgModule, ModuleWithProviders, InjectionToken, APP_INITIALIZER } from '@angular/core';
import { Store } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { IAuthenticationApiConfig, AUTH_CONFIG_TOKEN } from './config';
import { AuthService } from '../auth';

import { IAuth, Effects } from '../store';
import * as Actions from '../store/actions';

import { log } from '../log';
import { PasswordlessModule, PasswordlessSuccessComponent } from '../passwordless';

import { TwitterModule } from '../twitter';
import { GoogleModule } from '../google';
import { FacebookModule } from '../facebook';
import { AuthModule } from '../auth';

export function initializerFactory(auth: AuthService, store: Store<any>) {
  return function() {
    log.d('[AuthenticationApiModule:app init] Retrieving authentication info with stored token...');
    auth.authenticated
      .then((authData: IAuth) => {
        store.dispatch(new Actions.LoginSuccess(authData));
      })
      .catch(err => {
        log.i('Authentication lib init: not authenticated');
      });
  };
}

@NgModule({
  imports: [
    AuthModule,
    TwitterModule,
    GoogleModule,
    FacebookModule,
    PasswordlessModule,
    EffectsModule.forFeature([Effects])
  ],
  exports: [PasswordlessSuccessComponent]
})
export class AuthenticationApiModule {
  static forRoot(configFactory: any): ModuleWithProviders {
    return {
      ngModule: AuthenticationApiModule,
      providers: [
        { provide: AUTH_CONFIG_TOKEN, useFactory: configFactory },
        {
          provide: APP_INITIALIZER,
          useFactory: initializerFactory,
          deps: [AuthService, Store],
          multi: true
        }
      ]
    };
  }
}

export * from './config';
