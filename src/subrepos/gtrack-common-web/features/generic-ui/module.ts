import { AlertService, ConfirmService, GenericUiPlatformService } from './services';
import { CommonModule } from '@angular/common';
import {
  ComponentBusyIndicatorComponent,
  ConfirmDialogComponent,
  DynamicListComponent,
  ForPrimengComponent,
  ProgressSpinnerComponent
} from './components';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import {
  GENERIC_UI_PLATFORM_SERVICE,
  GenericUiModule as CommonGenericUiModule
} from '@common.features/generic-ui';
import { MessageService } from 'primeng/api';
import { NgModule } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    FontAwesomeModule,
    ConfirmDialogModule,
    TableModule,
    ToastModule,
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
