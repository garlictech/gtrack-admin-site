import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/primeng';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { LanguageModule } from '../language';
import { BusyIndicatorComponent } from './busy-indicator';
import { ConfirmDialogComponent } from './confirm-dialog';
import { DynamicListComponent } from './dynamic-list';

@NgModule({
  imports: [CommonModule, ConfirmDialogModule, LanguageModule, FontAwesomeModule],
  declarations: [BusyIndicatorComponent, ConfirmDialogComponent, DynamicListComponent],
  exports: [BusyIndicatorComponent, ConfirmDialogComponent, DynamicListComponent]
})
export class GenericComponentsModule {}

export * from './dynamic-list';
