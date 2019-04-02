import { NgModule } from '@angular/core';
import { LocalizeModule } from '@bit/garlictech.angular-features.common.localization';
import { TextCarouselComponent } from './components/text-carousel';

@NgModule({
  declarations: [TextCarouselComponent],
  imports: [LocalizeModule],
  exports: [TextCarouselComponent]
})
export class TextCarouselModule {}
