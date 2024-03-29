import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AuthModule } from '../auth';
import { OauthWindowModule } from '../oauth-window';
import { WindowModule } from '../window';
import { TwitterService } from './twitter.service';

@NgModule({
  imports: [OauthWindowModule, WindowModule, HttpClientModule, AuthModule],
  providers: [TwitterService]
})
export class TwitterModule {}

export { TwitterService };
