import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SlideShowComponent } from './components';

@NgModule({
  imports: [CommonModule, FontAwesomeModule],
  declarations: [SlideShowComponent],
  exports: [SlideShowComponent]
})
export class SlideshowModule {}
