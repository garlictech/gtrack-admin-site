import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subject, of, combineLatest } from 'rxjs';
import { takeUntil, filter, debounceTime, switchMap, take } from 'rxjs/operators';
import {
  PoiSelectors,
  GeoSearchSelectors,
  IGeoSearchContextState,
  IGeoSearchResponseItem
} from 'subrepos/gtrack-common-ngx';
import { IPoiStored } from 'subrepos/provider-client';
import { AdminMap, AdminMapService } from '../../../../shared/services/admin-map';
import { PoiEditorService } from '../../../../shared/services';
import { IGTrackPoi } from '../../../../shared/interfaces';
import { State } from '../../../../store';
import { hikeEditPoiActions, commonPoiActions } from '../../../../store/actions';
import {
  HikeEditPoiSelectors,
  HikeEditMapSelectors,
  HikeEditRoutePlannerSelectors,
  EditedHikeProgramSelectors
} from '../../../../store/selectors';

import _difference from 'lodash-es/difference';
import _intersection from 'lodash-es/intersection';

@Component({
  selector: 'app-hike-edit-pois-gtrack',
  templateUrl: './ui.html'
})
export class HikeEditPoisGTrackComponent implements OnInit, OnDestroy {
  @Input()
  isPlanning$: Observable<boolean>;
  public pois$: Observable<IGTrackPoi[]>;
  public segments$: Observable<any>;
  public searchContext$: Observable<IGeoSearchContextState | undefined>;
  public showOnrouteMarkers = true;
  public showOffrouteMarkers = true;
  public displayGTrackPoiModal = false;
  public modalPoi: IGTrackPoi;
  private _map: AdminMap;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _adminMapService: AdminMapService,
    private _poiEditorService: PoiEditorService,
    private _editedHikeProgramSelectors: EditedHikeProgramSelectors,
    private _hikeEditMapSelectors: HikeEditMapSelectors,
    private _hikeEditPoiSelectors: HikeEditPoiSelectors,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _geoSearchSelectors: GeoSearchSelectors,
    private _poiSelectors: PoiSelectors
  ) {}

  ngOnInit() {
    this._store
      .pipe(
        select(this._hikeEditMapSelectors.getMapId),
        takeUntil(this._destroy$),
        filter(id => id !== '')
      )
      .subscribe((mapId: string) => {
        this._map = this._adminMapService.getMapById(mapId);
      });

    // Get pois by id from geoSearch result
    combineLatest(
      this._store.pipe(
        select(this._geoSearchSelectors.getGeoSearch('gTrackPois')),
        takeUntil(this._destroy$)
      ),
      this._store.pipe(
        select(this._poiSelectors.getPoiIds),
        takeUntil(this._destroy$)
      )
    )
      .pipe(
        debounceTime(250),
        takeUntil(this._destroy$)
      )
      .subscribe(([searchData, inStorePoiIds]: [IGeoSearchResponseItem, string[]]) => {
        if (searchData) {
          const missingPoiIds = _difference(
            (<any>searchData).results,
            _intersection((<any>searchData).results, inStorePoiIds)
          );

          // Get only the not-loaded pois
          if (missingPoiIds && missingPoiIds.length > 0) {
            this._store.dispatch(new commonPoiActions.LoadPois(missingPoiIds));
          }
        }
      });

    // Poi list based on geoSearch results
    // dirty flag will change on add/remove gTrackPoi to/from the hike
    this.pois$ = combineLatest(
      this._store.pipe(
        select(this._poiSelectors.getAllPoisCount()),
        takeUntil(this._destroy$)
      ),
      this._store.pipe(
        select(this._editedHikeProgramSelectors.getStopsCount),
        takeUntil(this._destroy$)
      )
    ).pipe(
      filter(([poiCount, stopsCount]: [number, number]) => poiCount > 0),
      debounceTime(250),
      switchMap(([poiCount, stopsCount]: [number, number]) => {
        return this._store.pipe(
          select(this._geoSearchSelectors.getGeoSearchResults<IPoiStored>('gTrackPois', this._poiSelectors.getAllPois)),
          takeUntil(this._destroy$)
        );
      }),
      switchMap((pois: IPoiStored[]) => {
        return this._store.pipe(
          select(this._hikeEditRoutePlannerSelectors.getPath),
          debounceTime(250),
          takeUntil(this._destroy$),
          switchMap((path: any) => of([path, this._poiEditorService.organizePois(pois, path)])),
          switchMap(([path, organizedPois]: [any, IGTrackPoi[]]) => {
            return of([path, this._poiEditorService.handleHikeInclusion(organizedPois)]);
          }),
          switchMap(([path, organizedPois]: [any, IGTrackPoi[]]) => {
            return of(this._poiEditorService.getGTrackPoiDistanceFromOrigo(organizedPois, path));
          })
        );
      })
    );

    this.pois$
      .pipe(
        takeUntil(this._destroy$),
        debounceTime(250)
      )
      .subscribe((pois: IGTrackPoi[]) => {
        // Refresh markers
        this._poiEditorService.refreshPoiMarkers(this._map);
      });

    // Route info from the store (for disabling GET buttons)
    this.segments$ = this._store.pipe(
      select(this._hikeEditRoutePlannerSelectors.getSegments),
      takeUntil(this._destroy$)
    );

    //
    // Contexts
    //

    this.searchContext$ = this._store.pipe(
      select(this._geoSearchSelectors.getGeoSearchContext('gTrackPois')),
      takeUntil(this._destroy$)
    );

    //
    // Refresh markers
    //

    this._store
      .pipe(
        select(this._hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector('gTrack', 'showOnrouteMarkers')),
        takeUntil(this._destroy$),
        debounceTime(250)
      )
      .subscribe((value: boolean) => {
        this.showOnrouteMarkers = value;
        this.isPlanning$.pipe(take(1)).subscribe((isPlanning: boolean) => {
          if (isPlanning) {
            this._poiEditorService.refreshPoiMarkers(this._map);
          }
        });
      });

    this._store
      .pipe(
        select(this._hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector('gTrack', 'showOffrouteMarkers')),
        takeUntil(this._destroy$),
        debounceTime(250)
      )
      .subscribe((value: boolean) => {
        this.showOffrouteMarkers = value;
        this.isPlanning$.pipe(take(1)).subscribe((isPlanning: boolean) => {
          if (isPlanning) {
            this._poiEditorService.refreshPoiMarkers(this._map);
          }
        });
      });
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  /**
   * Get pois for the current subdomain
   */
  public getPois() {
    this._poiEditorService.getGTrackPois();
  }

  /**
   * Show onroute markers checkbox click
   */
  public toggleOnrouteMarkers() {
    this._store.dispatch(new hikeEditPoiActions.ToggleOnrouteMarkers('gTrack'));
  }

  /**
   * Show offroute markers checkbox click
   */
  public toggleOffrouteMarkers() {
    this._store.dispatch(new hikeEditPoiActions.ToggleOffrouteMarkers('gTrack'));
  }

  public openGTrackPoiModal = (poi: IGTrackPoi) => {
    this.modalPoi = poi;
    this.displayGTrackPoiModal = true;
  }

  public closeModal = () => {
    delete this.modalPoi;
    this.displayGTrackPoiModal = false;
  }
}
