import { NgModule, ModuleWithProviders, APP_INITIALIZER } from '@angular/core';
import { Store } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AuthenticationApiConfig } from './config';
import { AuthService } from '../auth';

import { IAuth, Effects } from '../store';
import * as Actions from '../store/actions';

import { log } from '../log';
import { PasswordlessModule, PasswordlessSuccessComponent } from '../passwordless';

import { TwitterModule } from '../twitter';
import { GoogleModule } from '../google';
import { FacebookModule } from '../facebook';
import { AuthModule } from '../auth';

@NgModule({
  imports: [AuthModule, TwitterModule, GoogleModule, FacebookModule, PasswordlessModule, EffectsModule.run(Effects)],
  providers: [Effects],
  exports: [PasswordlessSuccessComponent]
})
export class AuthenticationApiModule {
  static forRoot(config: AuthenticationApiConfig): ModuleWithProviders {
    return {
      ngModule: AuthenticationApiModule,
      providers: [
        {
          provide: AuthenticationApiConfig,
          useValue: config
        },
        {
          provide: APP_INITIALIZER,
          useFactory: (auth: AuthService, store: Store<any>) => () => {
            log.d('[AuthenticationApiModule:app init] Retrieving authentication info with stored token...');
            auth.authenticated
              .then((authData: IAuth) => {
                store.dispatch(new Actions.LoginSuccess(authData));
              })
              .catch(err => {
                log.i('Authentication lib init: not authenticated');
              });
          },
          deps: [AuthService, Store],
          multi: true
        }
      ]
    };
  }
}

export * from './config';

export interface User {
  id: string;
  createdAt: Date;
  email: string;
  facebookId: string;
  lastLogin: Date;
  modifiedAt: Date;
  roles: [string];
  verified: boolean;
}
