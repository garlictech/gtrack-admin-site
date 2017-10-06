import { NgModule } from '@angular/core';
import { OauthWindowService } from './oauth-window.service';
import { WindowModule } from '../window';

@NgModule({
  imports: [WindowModule],
  exports: [],
  declarations: [],
  providers: [OauthWindowService]
})
export class OauthWindowModule {}

export { OauthWindowService };
