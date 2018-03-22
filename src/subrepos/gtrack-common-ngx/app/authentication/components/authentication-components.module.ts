import { NgModule } from '@angular/core';
import { FacebookButtonComponent } from './facebook-button';
import { AuthenticationApiModule } from 'subrepos/authentication-api-ngx';

@NgModule({
  imports: [
    AuthenticationApiModule
  ],
  exports: [FacebookButtonComponent],
  declarations: [FacebookButtonComponent],
  providers: [],
})
export class AuthenticationComponentsModule { }
