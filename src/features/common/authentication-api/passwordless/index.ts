import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AuthModule } from '../auth';

import { PasswordlessSuccessComponent } from './passwordless-success.component';
import { PasswordlessService } from './passwordless.service';

@NgModule({
  declarations: [PasswordlessSuccessComponent],
  imports: [HttpClientModule, AuthModule],
  exports: [PasswordlessSuccessComponent],
  providers: [PasswordlessService]
})
export class PasswordlessModule {}

export { PasswordlessService, PasswordlessSuccessComponent };
