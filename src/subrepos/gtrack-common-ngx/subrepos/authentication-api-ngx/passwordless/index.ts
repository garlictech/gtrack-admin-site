import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AuthModule } from '../auth';

import { PasswordlessService } from './passwordless.service';
import { PasswordlessSuccessComponent } from './passwordless-success.component';

@NgModule({
  declarations: [PasswordlessSuccessComponent],
  imports: [HttpModule, AuthModule],
  exports: [PasswordlessSuccessComponent],
  providers: [PasswordlessService]
})
export class PasswordlessModule {}

export { PasswordlessService, PasswordlessSuccessComponent };
