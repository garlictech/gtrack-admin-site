import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store, MemoizedSelector } from '@ngrx/store';
import { State, hikeEditImageActions } from '../../../../store';
import {
  HikeEditPoiSelectors, HikeEditRoutePlannerSelectors, HikeEditImageSelectors, HikeEditMapSelectors
} from '../../../../store/selectors';
import { RoutePlannerService, PoiEditorService, AdminMap, AdminMapService } from '../../../../shared/services';
import { IBackgroundImageData, EPoiTypes } from 'subrepos/provider-client';
import { PoiSelectors } from 'subrepos/gtrack-common-ngx';
import * as _ from 'lodash';

@Component({
  selector: 'gt-hike-edit-photos',
  templateUrl: './ui.html'
})
export class HikeEditPhotosComponent implements OnInit, OnDestroy {
  @Input() backgroundImageSelector: MemoizedSelector<object, IBackgroundImageData[]>;
  @Input() backgroundImageUrlSelector: MemoizedSelector<object, string[]>;
  @Input() clickActions: any;
  @Input() distanceFrom: number[] = null;
  public gTrackPoiPhotos$: Observable<IBackgroundImageData[]>;
  public googlePhotos$: Observable<IBackgroundImageData[]>;
  public wikipediaPhotos$: Observable<IBackgroundImageData[]>;
  public mapillaryImages$: Observable<IBackgroundImageData[]>;
  public routePath$: Observable<any>;
  public mapillaryLoading$: Observable<boolean>;
  public bgImages$: Observable<IBackgroundImageData[]>;
  public backgroundOriginalUrls$: Observable<string[]>;
  public slideShowUrls: string[];
  private _map: AdminMap;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _routePlannerService: RoutePlannerService,
    private _poiSelectors: PoiSelectors,
    private _hikeEditMapSelectors: HikeEditMapSelectors,
    private _hikeEditPoiSelectors: HikeEditPoiSelectors,
    private _hikeEditImageSelectors: HikeEditImageSelectors,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _poiEditorService: PoiEditorService,
    private _adminMapService: AdminMapService,
  ) {}

  ngOnInit() {
    this._store
      .select(this._hikeEditMapSelectors.getMapId)
      .filter(id => id !== '')
      .takeUntil(this._destroy$)
      .subscribe((mapId: string) => {
        this._map = this._adminMapService.getMapById(mapId);
      });

    // Photo sources getAllPoiPhotos
    this.gTrackPoiPhotos$ = this._store
      .select(this._poiSelectors.getAllPoiPhotos())
      .takeUntil(this._destroy$);
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
    this.bgImages$ = this._store
      .select(this.backgroundImageSelector)
      .takeUntil(this._destroy$);
    this.backgroundOriginalUrls$ = this._store
      .select(this.backgroundImageUrlSelector)
      .takeUntil(this._destroy$);

    this.bgImages$
      .takeUntil(this._destroy$)
      .subscribe(images => {
        this.slideShowUrls =  _.map(images, 'original.url');
      });

    // Route info from the store (for disabling GET buttons)
    this.routePath$ = this._store.select(this._hikeEditRoutePlannerSelectors.getPath);
    this.mapillaryLoading$ = this._store.select(this._hikeEditImageSelectors.getHikeEditImageContextPropertySelector('mapillary', 'loading'));

    // Refresh markers
    this._store
      .select(this._hikeEditImageSelectors.getImageMarkerUrls)
      .takeUntil(this._destroy$)
      .subscribe(images => {
        this._poiEditorService.refreshPoiMarkers(this._map);
      });
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
