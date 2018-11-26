import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable, Subject, of, combineLatest } from 'rxjs';
import { takeUntil, switchMap, debounceTime, take } from 'rxjs/operators';
import { Store, MemoizedSelector, select } from '@ngrx/store';
import { State } from '../../../../store';
import { hikeEditImageActions } from '../../../../store/actions';
import * as hikeEditPoiSelectors from '../../../../store/selectors/hike-edit-poi';
import * as hikeEditImageSelectors from '../../../../store/selectors/hike-edit-image';
import * as hikeEditRoutePlannerSelectors from '../../../../store/selectors/hike-edit-route-planner';

import { RoutePlannerService, PoiEditorService, AdminMapService } from '../../../../shared/services';
import { IBackgroundImageData, EPoiTypes } from 'subrepos/provider-client';
import { PoiSelectors } from 'subrepos/gtrack-common-ngx';

import _map from 'lodash-es/map';

@Component({
  selector: 'app-hike-edit-photos',
  templateUrl: './ui.html'
})
export class HikeEditPhotosComponent implements OnInit, OnDestroy {
  @Input() backgroundImageSelector: MemoizedSelector<object, IBackgroundImageData[]>;
  @Input() backgroundImageUrlSelector: MemoizedSelector<object, string[]>;
  @Input() clickActions: any;
  @Input() showMarkerColumn: boolean;
  @Input() distanceFrom: number[] = null;
  public gTrackPoiPhotos$: Observable<IBackgroundImageData[]>;
  public googlePhotos$: Observable<IBackgroundImageData[]>;
  public wikipediaPhotos$: Observable<IBackgroundImageData[]>;
  public mapillaryImages$: Observable<IBackgroundImageData[]>;
  public flickrImages$: Observable<IBackgroundImageData[]>;
  public routePath$: Observable<any>;
  public mapillaryLoading$: Observable<boolean>;
  public flickrLoading$: Observable<boolean>;
  public bgImages$: Observable<IBackgroundImageData[]>;
  public backgroundOriginalUrls$: Observable<string[]>;
  public slideShowUrls: string[];
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _routePlannerService: RoutePlannerService,
    private _poiSelectors: PoiSelectors,
    private _poiEditorService: PoiEditorService,
    private _adminMapService: AdminMapService
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
      switchMap(([photos, path]: [IBackgroundImageData[], any]) => {
        return of(this._poiEditorService.organizePoiPhotos(photos, path));
      })
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

    this.bgImages$
      .pipe(takeUntil(this._destroy$))
      .subscribe((images: IBackgroundImageData[]) => {
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

  public getMapillaryPhotos() {
    const _bounds = this._routePlannerService.getSearchBounds();

    if (_bounds) {
      this.routePath$.pipe(take(1)).subscribe(path => {
        this._store.dispatch(new hikeEditImageActions.GetMapillaryImages(_bounds, path));
      });
    }
  }

  public getFlickrPhotos() {
    const _bounds = this._routePlannerService.getSearchBounds();

    if (_bounds) {
      this.routePath$.pipe(take(1)).subscribe(path => {
        this._store.dispatch(new hikeEditImageActions.GetFlickrImages(_bounds, path));
      });
    }
  }
}
