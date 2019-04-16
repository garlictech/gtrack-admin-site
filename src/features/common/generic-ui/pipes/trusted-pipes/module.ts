import { NgModule } from '@angular/core';

import { TrustedHtmlPipe } from './trusted-html.pipe';
import { TrustedResourcePipe } from './trusted-resource.pipe';
import { TrustedUrlPipe } from './trusted-url.pipe';

const COMPONENTS = [TrustedHtmlPipe, TrustedUrlPipe, TrustedResourcePipe];

@NgModule({
  exports: [...COMPONENTS],
  declarations: [COMPONENTS]
})
export class TrustedPipesModule {}
