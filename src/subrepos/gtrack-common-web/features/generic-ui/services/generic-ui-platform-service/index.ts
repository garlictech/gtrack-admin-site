import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AlertService } from '../alert';
import { Observable, of } from 'rxjs';
import { ConfirmService } from '../confirm';
import { IGenericUiPlatformService, IToast } from '@common.features/generic-ui';

@Injectable()
export class GenericUiPlatformService implements IGenericUiPlatformService {
  constructor(private _alert: AlertService, private _confirm: ConfirmService, private messageService: MessageService) {
    /* EMPTY */
  }

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

  displayToast(toast: IToast) {
    this.messageService.add(toast);
  }
}
