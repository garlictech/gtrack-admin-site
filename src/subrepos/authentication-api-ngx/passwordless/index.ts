import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AuthModule } from '../auth';

import { PasswordlessService } from './passwordless.service';
import { PasswordlessSuccessComponent } from './passwordless-success.component';

@NgModule({
  declarations: [PasswordlessSuccessComponent],
  imports: [HttpClientModule, AuthModule],
  exports: [PasswordlessSuccessComponent],
  providers: [PasswordlessService]
})
export class PasswordlessModule {}

export { PasswordlessService, PasswordlessSuccessComponent };
