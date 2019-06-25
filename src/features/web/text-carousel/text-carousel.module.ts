import { NgModule } from '@angular/core';
import { LocalizeModule } from '@bit/garlictech.angular-features.common.localization';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TextCarouselComponent } from './components/text-carousel/text-carousel.component';

@NgModule({
  declarations: [TextCarouselComponent],
  imports: [LocalizeModule, FontAwesomeModule],
  exports: [TextCarouselComponent]
})
export class TextCarouselModule {}
