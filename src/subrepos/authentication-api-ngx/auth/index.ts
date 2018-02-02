import { NgModule } from '@angular/core';

import { ApiModule } from '../api';
import { StorageModule } from '../storage';

import { AuthGuard } from './auth-guard.service';
import { AuthService } from './auth.service';
import { VerifySuccessComponent } from './verify-success.component';

@NgModule({
  imports: [ApiModule, StorageModule],
  providers: [AuthService, AuthGuard],
  declarations: [VerifySuccessComponent],
  exports: [VerifySuccessComponent]
})
export class AuthModule {}

export { AuthService, AuthGuard, VerifySuccessComponent };
