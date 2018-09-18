import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { GoogleService } from './google.service';
import { WindowModule } from '../window';
import { AuthModule } from '../auth';
import { OauthWindowModule } from '../oauth-window';

@NgModule({
  imports: [OauthWindowModule, WindowModule, HttpClientModule, AuthModule],
  providers: [GoogleService]
})
export class GoogleModule {}

export { GoogleService };
