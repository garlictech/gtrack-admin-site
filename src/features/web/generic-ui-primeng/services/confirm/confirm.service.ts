import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ConfirmService {
  constructor(
    private readonly _confirmationService: ConfirmationService,
    private readonly _translate: TranslateService
  ) {}

  confirm(titleLabel: string): Observable<boolean> {
    const promise = new Promise((resolve, reject) => {
      this._confirmationService.confirm({
        header: this._translate.instant('popup.confirmation'),
        icon: 'pi pi-question-circle',
        message: this._translate.instant(titleLabel),
        accept: resolve,
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
