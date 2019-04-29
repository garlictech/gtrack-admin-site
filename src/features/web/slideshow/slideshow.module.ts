import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SlideShowComponent } from './components';

@NgModule({
  imports: [CommonModule],
  declarations: [SlideShowComponent],
  exports: [SlideShowComponent]
})
export class SlideshowModule {}
