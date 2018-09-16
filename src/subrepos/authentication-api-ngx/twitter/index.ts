import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { OauthWindowModule } from '../oauth-window';
import { TwitterService } from './twitter.service';
import { WindowModule } from '../window';
import { AuthModule } from '../auth';

@NgModule({
  imports: [OauthWindowModule, WindowModule, HttpClientModule, AuthModule],
  providers: [TwitterService]
})
export class TwitterModule {}

export { TwitterService };
