import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { AuthModule, AuthService } from '../auth';
import { AUTH_CONFIG_TOKEN } from './config';

import { Auth, Effects } from '../store';
import * as Actions from '../store/actions';

import { log } from '../log';
import { PasswordlessModule, PasswordlessSuccessComponent } from '../passwordless';

import { FacebookModule } from '../facebook';
import { GoogleModule } from '../google';
import { TwitterModule } from '../twitter';

// tslint:disable:only-arrow-functions
export function initializerFactory(auth: AuthService, store: Store<any>): () => void {
  return function(): void {
    log.data('[AuthenticationApiModule:app init] Retrieving authentication info with stored token...');
    auth.authenticated.subscribe(
      (authData: Auth) => {
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
