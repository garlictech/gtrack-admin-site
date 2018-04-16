import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/primeng';

import { BusyIndicatorComponent } from './busy-indicator';
import { ConfirmDialogComponent } from './confirm-dialog';
import { DynamicListModule } from './dynamic-list';

@NgModule({
  imports: [CommonModule, ConfirmDialogModule],
  declarations: [BusyIndicatorComponent, ConfirmDialogComponent],
  exports: [BusyIndicatorComponent, ConfirmDialogComponent]
})
export class GenericComponentsModule {}

export * from './dynamic-list';
