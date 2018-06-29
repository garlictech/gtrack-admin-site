import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store, MemoizedSelector } from '@ngrx/store';
import { State, hikeEditImageActions } from 'app/store';
import {
  HikeEditPoiSelectors, HikeEditRoutePlannerSelectors, HikeEditImageSelectors, EditedHikeProgramSelectors
} from 'app/store/selectors';
import { RoutePlannerService } from 'app/shared/services/admin-map';
import { IBackgroundImageData, EPoiTypes } from 'subrepos/provider-client';

@Component({
  selector: 'gt-hike-edit-photos',
  templateUrl: './ui.html'
})
export class HikeEditPhotosComponent implements OnInit, OnDestroy {
  @Input() backgroundImageSelector: MemoizedSelector<object, IBackgroundImageData[]>;
  @Input() backgroundImageUrlSelector: MemoizedSelector<object, string[]>;
  @Input() clickActions: any;
  public googlePhotos$: Observable<IBackgroundImageData[]>;
  public wikipediaPhotos$: Observable<IBackgroundImageData[]>;
  public mapillaryImages$: Observable<IBackgroundImageData[]>;
  public routePath$: Observable<any>;
  public mapillaryLoading$: Observable<boolean>;
  public bgImages$: Observable<IBackgroundImageData[]>;
  public backgroundOriginalUrls$: Observable<string[]>;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _routePlannerService: RoutePlannerService,
    private _hikeEditPoiSelectors: HikeEditPoiSelectors,
    private _hikeEditImageSelectors: HikeEditImageSelectors,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors
  ) {}

  ngOnInit() {
    // Photo sources
    this.googlePhotos$ = this._store
      .select(this._hikeEditPoiSelectors.getPoiPhotos(EPoiTypes.google))
      .takeUntil(this._destroy$);

    this.wikipediaPhotos$ = this._store
      .select(this._hikeEditPoiSelectors.getPoiPhotos(EPoiTypes.wikipedia))
      .takeUntil(this._destroy$);

    this.mapillaryImages$ = this._store
      .select(this._hikeEditImageSelectors.getAllMapillaryImages)
      .takeUntil(this._destroy$);

    // Store path
    this.backgroundOriginalUrls$ = this._store
      .select(this.backgroundImageUrlSelector)
      .takeUntil(this._destroy$);

    this.bgImages$ = this._store
      .select(this.backgroundImageSelector)
      .takeUntil(this._destroy$);

    // Route info from the store (for disabling GET buttons)
    this.routePath$ = this._store
      .select(this._hikeEditRoutePlannerSelectors.getPath)
      .takeUntil(this._destroy$);

    this.mapillaryLoading$ = this._store
      .select(this._hikeEditImageSelectors.getHikeEditImageContextPropertySelector('mapillary', 'loading'))
      .takeUntil(this._destroy$);
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  public getMapillaryPhotos() {
    let _bounds = this._routePlannerService.getSearchBounds();

    if (_bounds) {
      // Get pois for the current domain
      this._store.dispatch(new hikeEditImageActions.GetMapillaryImages(_bounds));
    }
  }
}
