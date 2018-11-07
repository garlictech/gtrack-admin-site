import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from '../../../store';
import { Observable, of, Subject } from 'rxjs';
import { take, takeUntil, switchMap } from 'rxjs/operators';
import { HikeEditRoutePlannerSelectors, EditedHikeProgramSelectors } from '../../../store/selectors';
import { subscribeOn } from 'rxjs-compat/operator/subscribeOn';
import { editedHikeProgramActions } from 'app/store/actions';

@Component({
  selector: 'app-image-marker-popup',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class ImageMarkerPopupComponent implements OnInit, OnDestroy {
  public static componentName = 'ImageMarkerPopupComponent';
  public isPlanning$: Observable<boolean>;
  public isBackground: boolean;
  public data: any;
  public closePopup: any;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _editedHikeProgramSelectors: EditedHikeProgramSelectors,
  ) {}

  ngOnInit() {
    this.isPlanning$ = this._store
      .pipe(
        select(this._hikeEditRoutePlannerSelectors.getIsPlanning),
        take(1)
      );

    this._store
      .pipe(
        select(this._editedHikeProgramSelectors.getBackgroundOriginalUrls()),
        switchMap((bgImageUrls: string[]) => {
          return of(bgImageUrls.includes(this.data.original.url));
        }),
        takeUntil(this._destroy$)
      )
      .subscribe(isBG => {
        this.isBackground = isBG;
      });
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public toggleBackgroundImage() {
    if (this.isBackground) {
      this._store.dispatch(new editedHikeProgramActions.RemoveHikeProgramBackgroundImage(this.data.original.url));
    } else {
      this._store.dispatch(new editedHikeProgramActions.AddHikeProgramBackgroundImage(this.data));
    }
  }
}
