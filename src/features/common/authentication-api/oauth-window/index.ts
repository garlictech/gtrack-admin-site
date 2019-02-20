import { NgModule } from '@angular/core';
import { WindowModule } from '../window';
import { OauthWindowService } from './oauth-window.service';

@NgModule({
  imports: [WindowModule],
  exports: [],
  declarations: [],
  providers: [OauthWindowService]
})
export class OauthWindowModule {}

export { OauthWindowService };
