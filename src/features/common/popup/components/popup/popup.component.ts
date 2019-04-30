import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { getPopup, PopupData } from '../../store';

@Component({
  selector: 'app-popup',
  template: ''
})
export class PopupComponent implements OnInit, OnDestroy {
  popupData: PopupData;
  display: boolean;
  private readonly _componentDestroyed$: Subject<boolean>;

  constructor(private readonly _store: Store<any>) {
    this._componentDestroyed$ = new Subject();
  }

  ngOnInit(): void {
    this._store
      .pipe(
        select(getPopup),
        takeUntil(this._componentDestroyed$),
        filter(popup => !!popup.message)
      )
      .subscribe((popup: PopupData) => {
        this.popupData = popup;
        this.display = true;
      });
  }

  dismiss(): void {
    this.display = false;
  }

  ngOnDestroy(): void {
    this._componentDestroyed$.next(true);
    this._componentDestroyed$.complete();
  }
}
