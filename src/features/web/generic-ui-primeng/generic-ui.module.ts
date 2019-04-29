import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  GENERIC_UI_PLATFORM_SERVICE,
  GenericUiModule as CommonGenericUiModule
} from '@bit/garlictech.angular-features.common.generic-ui';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

import {
  ComponentBusyIndicatorComponent,
  ConfirmDialogComponent,
  DynamicListComponent,
  ForPrimengComponent,
  ProgressSpinnerComponent
} from './components';
import { AlertService, ConfirmService, GenericUiPlatformService } from './services';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    FontAwesomeModule,
    ConfirmDialogModule,
    TableModule,
    TranslateModule,
    CommonGenericUiModule
  ],
  declarations: [
    ConfirmDialogComponent,
    ComponentBusyIndicatorComponent,
    ProgressSpinnerComponent,
    ForPrimengComponent,
    DynamicListComponent
  ],
  exports: [
    ConfirmDialogComponent,
    ComponentBusyIndicatorComponent,
    ProgressSpinnerComponent,
    ForPrimengComponent,
    DynamicListComponent
  ],
  providers: [
    MessageService,
    AlertService,
    ConfirmService,
    ConfirmationService,
    { provide: GENERIC_UI_PLATFORM_SERVICE, useClass: GenericUiPlatformService }
  ]
})
export class GenericUiModule {}
