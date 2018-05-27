import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import { State } from 'app/store';

import { IGooglePhotoInfo, IWikipediaPhotoInfo } from 'app/shared/interfaces';
import { HikeEditPoiSelectors } from '../../../../store/selectors';

@Component({
  selector: 'gt-hike-edit-photos',
  templateUrl: './ui.html'
})
export class HikeEditPhotosComponent implements OnInit, OnDestroy {
  public googlePhotos$: Observable<IGooglePhotoInfo[]>;
  public wikipediaPhotos$: Observable<IWikipediaPhotoInfo[]>;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _hikeEditPoiSelectors: HikeEditPoiSelectors
  ) {}

  ngOnInit() {
    this.googlePhotos$ = this._store
      .select(this._hikeEditPoiSelectors.getPoiPhotos('google'))
      .takeUntil(this._destroy$);

    this.wikipediaPhotos$ = this._store
      .select(this._hikeEditPoiSelectors.getPoiPhotos('wikipedia'))
      .takeUntil(this._destroy$);
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

}
