import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { from, of } from 'rxjs';

@Injectable()
export class AlertService {
  constructor(
    private _confirmationService: ConfirmationService,
    private _translate: TranslateService
  ) {
    /* EMPTY */
  }

  alert(titleLabel: string) {
    const promise = new Promise((resolve, reject) => {
      this._confirmationService.confirm({
        header: this._translate.instant('popup.alert'),
        icon: 'pi pi-exclamation-triangle',
        message: this._translate.instant(titleLabel),
        acceptLabel: this._translate.instant('labels.ok'),
        accept: () => resolve(),
        reject: () => reject(),
        rejectVisible: false
      });
    });

    return from(promise).pipe(
      map(() => true),
      catchError(() => of(true))
    );
  }
}
