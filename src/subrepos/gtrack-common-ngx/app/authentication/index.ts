import { NgModule } from '@angular/core';
import { Selectors as DeepstreamSelectors } from '@bit/garlictech.angular-features.common.deepstream-ngx';
import { AuthGuard, NotAuthGuard, RoleGuard } from './guards';
import { AuthenticationSelectors } from './store';

@NgModule({
  providers: [
    {
      provide: AuthenticationSelectors.Selectors,
      useClass: AuthenticationSelectors.Selectors,
      deps: [DeepstreamSelectors]
    },
    NotAuthGuard,
    AuthGuard,
    RoleGuard
  ]
})
export class AuthenticationModule {}

export * from './store';
export { AuthenticationActions } from './store';
export { EAuthRoles } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
export { NotAuthGuard, AuthenticationSelectors };
export {
  User,
  ApiService,
  PasswordlessSuccessComponent
} from '@bit/garlictech.angular-features.common.authentication-api';
