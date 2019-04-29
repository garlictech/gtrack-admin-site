import { Injectable } from '@angular/core';
import { GenericUiPlatformServiceData, Toast } from '@bit/garlictech.angular-features.common.generic-ui';
import { MessageService } from 'primeng/api';
import { Observable, of } from 'rxjs';
import { AlertService } from '../alert';
import { ConfirmService } from '../confirm/confirm.service';

@Injectable()
export class GenericUiPlatformService implements GenericUiPlatformServiceData {
  constructor(
    private readonly _alert: AlertService,
    private readonly _confirm: ConfirmService,
    private readonly messageService: MessageService
  ) {}

  alert(titleLabel?: string): Observable<boolean> {
    return this._alert.alert(titleLabel);
  }

  confirm(titleLabel?: string): Observable<boolean> {
    return this._confirm.confirm(titleLabel);
  }

  displayLoader(): Observable<boolean> {
    return of(true);
  }

  dismissLoader(): Observable<boolean> {
    return of(true);
  }

  displayToast(toast: Toast): void {
    this.messageService.add(toast);
  }
}
