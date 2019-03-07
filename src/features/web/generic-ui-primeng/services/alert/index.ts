import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class AlertService {
  constructor(
    private readonly _confirmationService: ConfirmationService,
    private readonly _translate: TranslateService
  ) {}

  alert(titleLabel: string): Observable<boolean> {
    const promise = new Promise((resolve, reject) => {
      this._confirmationService.confirm({
        header: this._translate.instant('popup.alert'),
        icon: 'pi pi-exclamation-triangle',
        message: this._translate.instant(titleLabel),
        acceptLabel: this._translate.instant('labels.ok'),
        accept: resolve,
        reject,
        rejectVisible: false
      });
    });

    return from(promise).pipe(
      map(() => true),
      catchError(() => of(true))
    );
  }
}
