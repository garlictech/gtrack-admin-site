import _map from 'lodash-es/map';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { debounceTime, switchMap, take, takeUntil } from 'rxjs/operators';
import { PoiSelectors } from 'subrepos/gtrack-common-ngx';
import { BackgroundImageData, EPoiTypes } from 'subrepos/provider-client';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MemoizedSelector, select, Store } from '@ngrx/store';

import { AdminMapService, PoiEditorService, RoutePlannerService } from '../../../../shared/services';
import { State } from '../../../../store';
import { hikeEditImageActions } from '../../../../store/actions';
import * as hikeEditImageSelectors from '../../../../store/selectors/hike-edit-image';
import * as hikeEditPoiSelectors from '../../../../store/selectors/hike-edit-poi';
import * as hikeEditRoutePlannerSelectors from '../../../../store/selectors/hike-edit-route-planner';

@Component({
  selector: 'app-hike-edit-photos',
  templateUrl: './ui.html'
})
export class HikeEditPhotosComponent implements OnInit, OnDestroy {
  @Input() backgroundImageSelector: MemoizedSelector<object, Array<BackgroundImageData>>;
  @Input() backgroundImageUrlSelector: MemoizedSelector<object, Array<string>>;
  @Input() clickActions: any;
  @Input() showMarkerColumn: boolean;
  @Input() distanceFrom: Array<number> = null;
  gTrackPoiPhotos$: Observable<Array<BackgroundImageData>>;
  googlePhotos$: Observable<Array<BackgroundImageData>>;
  wikipediaPhotos$: Observable<Array<BackgroundImageData>>;
  mapillaryImages$: Observable<Array<BackgroundImageData>>;
  flickrImages$: Observable<Array<BackgroundImageData>>;
  routePath$: Observable<any>;
  mapillaryLoading$: Observable<boolean>;
  flickrLoading$: Observable<boolean>;
  bgImages$: Observable<Array<BackgroundImageData>>;
  backgroundOriginalUrls$: Observable<Array<string>>;
  slideShowUrls: Array<string>;
  private readonly _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private readonly _store: Store<State>,
    private readonly _routePlannerService: RoutePlannerService,
    private readonly _poiSelectors: PoiSelectors,
    private readonly _poiEditorService: PoiEditorService,
    private readonly _adminMapService: AdminMapService
  ) {}

  ngOnInit() {
    // Photo sources getAllPoiPhotos
    this.gTrackPoiPhotos$ = combineLatest(
      this._store.pipe(
        select(this._poiSelectors.getAllPoiPhotos()),
        takeUntil(this._destroy$)
      ),
      this._store.pipe(
        select(hikeEditRoutePlannerSelectors.getPath),
        takeUntil(this._destroy$)
      )
    ).pipe(
      debounceTime(250),
      switchMap(([photos, path]: [Array<BackgroundImageData>, any]) =>
        of(this._poiEditorService.organizePoiPhotos(photos, path))
      )
    );

    this.googlePhotos$ = this._store.pipe(
      select(hikeEditPoiSelectors.getPoiPhotos(EPoiTypes.google)),
      takeUntil(this._destroy$),
      debounceTime(250)
    );
    this.wikipediaPhotos$ = this._store.pipe(
      select(hikeEditPoiSelectors.getPoiPhotos(EPoiTypes.wikipedia)),
      takeUntil(this._destroy$),
      debounceTime(250)
    );
    this.mapillaryImages$ = this._store.pipe(
      select(hikeEditImageSelectors.getAllMapillaryImages),
      takeUntil(this._destroy$),
      debounceTime(250)
    );
    this.flickrImages$ = this._store.pipe(
      select(hikeEditImageSelectors.getAllFlickrImages),
      takeUntil(this._destroy$),
      debounceTime(250)
    );

    // Store path
    this.bgImages$ = this._store.pipe(
      select(this.backgroundImageSelector),
      takeUntil(this._destroy$),
      debounceTime(250)
    );
    this.backgroundOriginalUrls$ = this._store.pipe(
      select(this.backgroundImageUrlSelector),
      takeUntil(this._destroy$),
      debounceTime(250)
    );

    this.bgImages$.pipe(takeUntil(this._destroy$)).subscribe((images: Array<BackgroundImageData>) => {
      this.slideShowUrls = _map(images, 'original.url');
    });

    // Route info from the store (for disabling GET buttons)
    this.routePath$ = this._store.pipe(select(hikeEditRoutePlannerSelectors.getPath));
    this.mapillaryLoading$ = this._store.pipe(
      select(hikeEditImageSelectors.getHikeEditImageContextPropertySelector('mapillary', 'loading'))
    );
    this.flickrLoading$ = this._store.pipe(
      select(hikeEditImageSelectors.getHikeEditImageContextPropertySelector('flickr', 'loading'))
    );

    // Refresh markers
    this._store
      .pipe(
        select(hikeEditImageSelectors.getImageMarkerImages),
        takeUntil(this._destroy$),
        debounceTime(250)
      )
      .subscribe(() => {
        this._poiEditorService.refreshPoiMarkers();
      });
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  getMapillaryPhotos() {
    const _bounds = this._routePlannerService.getSearchBounds();

    if (_bounds) {
      this.routePath$.pipe(take(1)).subscribe(path => {
        this._store.dispatch(new hikeEditImageActions.GetMapillaryImages(_bounds, path));
      });
    }
  }

  getFlickrPhotos() {
    const _bounds = this._routePlannerService.getSearchBounds();

    if (_bounds) {
      this.routePath$.pipe(take(1)).subscribe(path => {
        this._store.dispatch(new hikeEditImageActions.GetFlickrImages(_bounds, path));
      });
    }
  }
}
