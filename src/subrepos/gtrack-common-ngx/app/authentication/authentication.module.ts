import { NgModule } from '@angular/core';
import { Store } from '@ngrx/store';

import { AuthenticationAgents } from './store';

@NgModule({
  providers: [
    AuthenticationAgents
  ],
})
export class AuthenticationModule {
  constructor(authenticationAgents: AuthenticationAgents) {
    authenticationAgents.start();
  }
}
