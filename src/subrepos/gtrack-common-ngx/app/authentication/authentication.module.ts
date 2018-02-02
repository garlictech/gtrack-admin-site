import { NgModule } from '@angular/core';

import { AuthenticationEffects } from './store';

@NgModule({
  providers: [
    AuthenticationEffects
  ],
})
export class AuthenticationModule { }
