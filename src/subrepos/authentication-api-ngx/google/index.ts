import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { GoogleService } from './google.service';
import { WindowModule } from '../window';
import { AuthModule } from '../auth';
import { OauthWindowModule } from '../oauth-window';

import '!file-loader?name=google/success.html!./success.html';

@NgModule({
  imports: [OauthWindowModule, WindowModule, HttpModule, AuthModule],
  providers: [GoogleService],
})
export class GoogleModule {}

export { GoogleService };
