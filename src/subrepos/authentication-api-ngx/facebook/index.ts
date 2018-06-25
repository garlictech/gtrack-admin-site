import { NgModule } from '@angular/core';
import { FacebookService } from './facebook.service';
import { WindowModule } from '../window';
import { AuthModule } from '../auth';
import { HttpModule } from '@angular/http';
import { OauthWindowModule } from '../oauth-window';

@NgModule({
  imports: [OauthWindowModule, WindowModule, HttpModule, AuthModule],
  providers: [FacebookService]
})
export class FacebookModule {}

export { FacebookService };
