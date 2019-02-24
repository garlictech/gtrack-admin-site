import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { AuthService } from '../auth';
import { AUTH_CONFIG_TOKEN } from './config';

import { Effects, IAuth } from '../store';
import * as Actions from '../store/actions';

import { log } from '../log';
import { PasswordlessModule, PasswordlessSuccessComponent } from '../passwordless';

import { AuthModule } from '../auth';
import { FacebookModule } from '../facebook';
import { GoogleModule } from '../google';
import { TwitterModule } from '../twitter';

export function initializerFactory(auth: AuthService, store: Store<any>) {
  return function() {
    log.data('[AuthenticationApiModule:app init] Retrieving authentication info with stored token...');
    auth.authenticated.subscribe(
      (authData: IAuth) => {
        store.dispatch(new Actions.LoginSuccess(authData));
      },
      err => {
        log.info('Authentication lib init: not authenticated');
      }
    );
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
