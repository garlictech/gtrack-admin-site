import { NgModule } from '@angular/core';
import { ProgressiveImageLoaderDirective } from './directives/progressive-image-loader.directive';

@NgModule({
  declarations: [ProgressiveImageLoaderDirective],
  exports: [ProgressiveImageLoaderDirective]
})
export class ProgressiveImageLoaderModule {}
