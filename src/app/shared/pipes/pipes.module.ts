import { NgModule } from '@angular/core';
import { ObjectToArrayPipe } from './object-to-array.pipe';
import { TrustedHtmlPipe } from './trusted-html.pipe';
import { TrustedUrlPipe } from './trusted-url.pipe';

const COMPONENTS = [
  ObjectToArrayPipe,
  TrustedHtmlPipe,
  TrustedUrlPipe
];

@NgModule({
  exports: [
    ...COMPONENTS
  ],
  declarations: [
    COMPONENTS
  ]
})
export class PipesModule {}
