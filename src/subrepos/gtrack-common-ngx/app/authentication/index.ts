import { NgModule } from '@angular/core';
import { AuthenticationSelectors } from './store';
import { NotAuthGuard } from './guards';
import { Selectors as DeepstreamSelectors } from '../../../deepstream-ngx';

@NgModule({
  providers: [
    {
      provide: AuthenticationSelectors.Selectors,
      useClass: AuthenticationSelectors.Selectors,
      deps: [DeepstreamSelectors]
    },
    NotAuthGuard
  ]
})
export class AuthenticationModule {}

export * from './store';
export { AuthenticationActions } from './store';
export { EAuthRoles } from '../../../provider-client';
export { NotAuthGuard, AuthenticationSelectors };
export { User, ApiService, PasswordlessSuccessComponent } from '../../../authentication-api-ngx';
