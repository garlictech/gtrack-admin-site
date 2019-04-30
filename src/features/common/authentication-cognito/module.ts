import { ModuleWithProviders, NgModule } from '@angular/core';
import { COGNITO_CONFIG } from './config';

@NgModule({})
export class AuthenticationCognitoModule {
  static forRoot(config): ModuleWithProviders {
    return {
      ngModule: AuthenticationCognitoModule,
      providers: [{ provide: COGNITO_CONFIG, useValue: config }]
    };
  }
}
