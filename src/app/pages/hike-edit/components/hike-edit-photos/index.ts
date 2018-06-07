import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import { State, hikeEditImageActions } from 'app/store';

import { IGooglePhotoInfo, IWikipediaPhotoInfo, IMapillaryImage } from 'app/shared/interfaces';
import { HikeEditPoiSelectors, HikeEditRoutePlannerSelectors, HikeEditImageSelectors } from 'app/store/selectors';
import { RoutePlannerService } from 'app/shared/services/admin-map';

@Component({
  selector: 'gt-hike-edit-photos',
  templateUrl: './ui.html'
})
export class HikeEditPhotosComponent implements OnInit, OnDestroy {
  public googlePhotos$: Observable<IGooglePhotoInfo[]>;
  public wikipediaPhotos$: Observable<IWikipediaPhotoInfo[]>;
  public mapillaryImages$: Observable<IMapillaryImage[]>;
  public routePath$: Observable<any>;
  public mapillaryLoading$: Observable<boolean>;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _routePlannerService: RoutePlannerService,
    private _hikeEditPoiSelectors: HikeEditPoiSelectors,
    private _hikeEditImageSelectors: HikeEditImageSelectors,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors
  ) {}

  ngOnInit() {
    this.googlePhotos$ = this._store
      .select(this._hikeEditPoiSelectors.getPoiPhotos('google'))
      .takeUntil(this._destroy$);

    this.wikipediaPhotos$ = this._store
      .select(this._hikeEditPoiSelectors.getPoiPhotos('wikipedia'))
      .takeUntil(this._destroy$);

    this.mapillaryImages$ = this._store
      .select(this._hikeEditImageSelectors.getAllMapillaryImages)
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
