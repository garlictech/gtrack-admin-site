import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { OauthWindowModule } from '../oauth-window';
import { TwitterService } from './twitter.service';
import { WindowModule } from '../window';
import { AuthModule } from '../auth';

import '!file-loader?name=twitter/success.html!./success.html';

@NgModule({
  imports: [OauthWindowModule, WindowModule, HttpModule, AuthModule],
  providers: [TwitterService]
})
export class TwitterModule {}

export { TwitterService };
