import { editedHikeProgramActions } from 'app/store/actions';
import { Observable, of, Subject } from 'rxjs';
import { switchMap, take, takeUntil } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { State } from '../../../store';
import * as editedHikeProgramSelectors from '../../../store/selectors/edited-hike-program';
import * as hikeEditRoutePlannerSelectors from '../../../store/selectors/hike-edit-route-planner';

@Component({
  selector: 'app-image-marker-popup',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class ImageMarkerPopupComponent implements OnInit, OnDestroy {
  // tslint:disable-next-line:no-property-initializers
  static componentName = 'ImageMarkerPopupComponent';
  isPlanning$: Observable<boolean>;
  isBackground: boolean;
  data: any;
  closePopup: any;

  private readonly _destroy$: Subject<boolean>;

  constructor(private readonly _store: Store<State>) {
    this.isPlanning$ = this._store.pipe(
      select(hikeEditRoutePlannerSelectors.getIsPlanning),
      take(1)
    );

    this.isBackground = false;
    this._destroy$ = new Subject<boolean>();
  }

  ngOnInit(): void {
    this._store
      .pipe(
        select(editedHikeProgramSelectors.getBackgroundOriginalUrls()),
        switchMap((bgImageUrls: Array<string>) => of(bgImageUrls.includes(this.data.original.url))),
        takeUntil(this._destroy$)
      )
      .subscribe(isBG => {
        this.isBackground = isBG;
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  toggleBackgroundImage(): void {
    if (this.isBackground) {
      this._store.dispatch(new editedHikeProgramActions.RemoveHikeProgramBackgroundImage(this.data.original.url));
    } else {
      this._store.dispatch(new editedHikeProgramActions.AddHikeProgramBackgroundImage(this.data));
    }
  }
}
