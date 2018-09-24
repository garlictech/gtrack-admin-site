import { NgModule } from '@angular/core';
import { FacebookService } from './facebook.service';
import { WindowModule } from '../window';
import { AuthModule } from '../auth';
import { HttpClientModule } from '@angular/common/http';
import { OauthWindowModule } from '../oauth-window';

@NgModule({
  imports: [OauthWindowModule, WindowModule, HttpClientModule, AuthModule],
  providers: [FacebookService]
})
export class FacebookModule {}

export { FacebookService };
