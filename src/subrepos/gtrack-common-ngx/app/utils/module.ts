import { NgModule } from '@angular/core';
import { PageBusyComponent } from './page-busy';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  declarations: [PageBusyComponent],
  exports: [PageBusyComponent]
})
export class UtilsModule {}
