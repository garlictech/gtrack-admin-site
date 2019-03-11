import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AuthModule } from '../auth';
import { OauthWindowModule } from '../oauth-window';
import { WindowModule } from '../window';
import { FacebookService } from './facebook.service';

@NgModule({
  imports: [OauthWindowModule, WindowModule, HttpClientModule, AuthModule],
  providers: [FacebookService]
})
export class FacebookModule {}

export { FacebookService };
