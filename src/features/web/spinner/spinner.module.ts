import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SpinnerModule as CommonSpinnerModule } from '@bit/garlictech.angular-features.common.spinner';
import { SpinnerComponent } from './components/spinner';
@NgModule({
  declarations: [SpinnerComponent],
  imports: [CommonModule, CommonSpinnerModule],
  exports: [SpinnerComponent]
})
export class SpinnerModule {}
