import { ModuleWithProviders, NgModule } from '@angular/core';

import { AuthModule } from '../auth';
import { FacebookModule } from '../facebook';
import { GoogleModule } from '../google';
import { PasswordlessModule, PasswordlessSuccessComponent } from '../passwordless';
import { TwitterModule } from '../twitter';
import { AUTH_CONFIG_TOKEN } from './config';

@NgModule({
  imports: [AuthModule, TwitterModule, GoogleModule, FacebookModule, PasswordlessModule],
  exports: [PasswordlessSuccessComponent]
})
export class AuthenticationApiModule {
  static forRoot(configFactory: any): ModuleWithProviders {
    return {
      ngModule: AuthenticationApiModule,
      providers: [{ provide: AUTH_CONFIG_TOKEN, useFactory: configFactory }]
    };
  }
}

export * from './config';
