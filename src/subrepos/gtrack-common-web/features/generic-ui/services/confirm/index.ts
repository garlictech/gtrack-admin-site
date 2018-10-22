import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { from, of } from 'rxjs';

@Injectable()
export class ConfirmService {
  constructor(
    private _confirmationService: ConfirmationService,
    private _translate: TranslateService
  ) {
    /* EMPTY */
  }

  confirm(titleLabel: string) {
    const promise = new Promise((resolve, reject) => {
      this._confirmationService.confirm({
        header: this._translate.instant('popup.confirmation'),
        icon: 'pi pi-question-circle',
        message: this._translate.instant(titleLabel),
        accept: () => resolve(),
        reject: () => reject({}),
        rejectVisible: true
      });
    });

    return from(promise).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
