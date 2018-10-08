import { NgModule } from '@angular/core';
import { ObjectToArrayPipe } from './object-to-array.pipe';
import { TrustedHtmlPipe } from './trusted-html.pipe';
import { TrustedUrlPipe } from './trusted-url.pipe';
import { OrderByPipe } from './order-by';

const COMPONENTS = [
  ObjectToArrayPipe,
  TrustedHtmlPipe,
  TrustedUrlPipe,
  OrderByPipe
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
