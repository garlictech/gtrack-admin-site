import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AuthModule } from '../auth';
import { OauthWindowModule } from '../oauth-window';
import { WindowModule } from '../window';
import { GoogleService } from './google.service';

@NgModule({
  imports: [OauthWindowModule, WindowModule, HttpClientModule, AuthModule],
  providers: [GoogleService]
})
export class GoogleModule {}

export { GoogleService };
