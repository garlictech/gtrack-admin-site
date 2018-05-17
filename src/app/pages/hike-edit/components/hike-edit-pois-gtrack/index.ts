import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import {
  PoiSelectors, CenterRadius, GeoSearchSelectors, Poi, PoiSaved, IGeoSearchContextState, IGeoSearchResponseItem
} from 'subrepos/gtrack-common-ngx';
import { IPoiStored, IPoi, IHikeProgramStop } from 'subrepos/provider-client';
import { AdminMap, AdminMapService, AdminMapMarker } from 'app/shared/services/admin-map';
import { PoiEditorService } from 'app/shared/services';
import { IGTrackPoi } from 'app/shared/interfaces';
import {
  State, hikeEditPoiActions, IExternalPoiListContextState, commonPoiActions
} from 'app/store';
import {
  HikeEditPoiSelectors, HikeEditMapSelectors, HikeEditRoutePlannerSelectors, EditedHikeProgramSelectors
} from 'app/store/selectors';

import * as _ from 'lodash';
import * as uuid from 'uuid/v1';

@Component({
  selector: 'gt-hike-edit-pois-gtrack',
  templateUrl: './ui.html'
})
export class HikeEditPoisGTrackComponent implements OnInit, OnDestroy {
  public pois$: Observable<IGTrackPoi[]>;
  public routePath$: Observable<any>;
  public searchContext$: Observable<IGeoSearchContextState | undefined>;
  public showOnrouteMarkers$: Observable<boolean>;
  public showOffrouteMarkers$: Observable<boolean>;
  private _map: AdminMap;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _adminMapService: AdminMapService,
    private _poiEditorService: PoiEditorService,
    private _hikeEditMapSelectors: HikeEditMapSelectors,
    private _hikeEditPoiSelectors: HikeEditPoiSelectors,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _editedHikeProgramSelectors: EditedHikeProgramSelectors,
    private _geoSearchSelectors: GeoSearchSelectors,
    private _poiSelectors: PoiSelectors
  ) {}

  ngOnInit() {
    this._store
      .select(this._hikeEditMapSelectors.getMapId)
      .takeUntil(this._destroy$)
      .filter(id => id !== '')
      .subscribe((mapId: string) => {
        this._map = this._adminMapService.getMapById(mapId);
      });

    // Get pois by id from geoSearch result
    Observable.combineLatest(
      this._store.select(this._geoSearchSelectors.getGeoSearch('gTrackPois')),
      this._store.select(this._poiSelectors.getPoiIds)
    )
      .takeUntil(this._destroy$)
      .subscribe(([searchData, inStorePoiIds]: [IGeoSearchResponseItem, string[]]) => {
        if (searchData) {
          const missingPoiIds = _.difference((<any>searchData).results, _.intersection((<any>searchData).results, inStorePoiIds))
          // Get only the not-loaded pois
          if (missingPoiIds && missingPoiIds.length > 0) {
            this._store.dispatch(new commonPoiActions.LoadPois(missingPoiIds));
          }
        }
      });

    // Poi list based on geoSearch results
    // dirty flag will change on add/remove gTrackPoi to/from the hike
    this.pois$ = this._store
      .select(this._geoSearchSelectors.getGeoSearchResults<IPoiStored>('gTrackPois', this._poiSelectors.getAllPois))
      .takeUntil(this._destroy$)
      .filter((pois: IPoiStored[]) => typeof pois !== 'undefined' && pois.length > 0)
      .switchMap((pois: IPoiStored[]) => {
        return this._store
          .select(this._hikeEditRoutePlannerSelectors.getPath)
          .take(1)
          .switchMap((path: any) => {
            return Observable.of(this._poiEditorService.organizePois(pois, path));
          })
        }
      )
      .switchMap((pois: IGTrackPoi[]) => {
        return this._store
          .select(this._editedHikeProgramSelectors.getStops)
          .takeUntil(this._destroy$)
          .switchMap((stops: any) => {
            return Observable.of(this._poiEditorService.handleHikeInclusion(pois));
          })
      });

    this.pois$
      .debounceTime(200)
      .takeUntil(this._destroy$)
      .subscribe((pois: IGTrackPoi[]) => {
        // Refresh markers
        this._poiEditorService.refreshPoiMarkers(this._map);
      });

    // Route info from the store (for disabling GET buttons)
    this.routePath$ = this._store.select(this._hikeEditRoutePlannerSelectors.getPath);

    //
    // Contexts
    //

    this.searchContext$ = this._store
      .select(this._geoSearchSelectors.getGeoSearchContext('gTrackPois'))
      .takeUntil(this._destroy$);

    this.showOnrouteMarkers$ = this._store
      .select(this._hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector('gTrack', 'showOnrouteMarkers'))
      .takeUntil(this._destroy$);

    this.showOffrouteMarkers$ = this._store
      .select(this._hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector('gTrack', 'showOffrouteMarkers'))
      .takeUntil(this._destroy$);

    //
    // Refresh markers
    //

    this.showOnrouteMarkers$
      .takeUntil(this._destroy$)
      .subscribe(() => {
        this._poiEditorService.refreshPoiMarkers(this._map);
      });

    this.showOffrouteMarkers$
      .takeUntil(this._destroy$)
      .subscribe(() => {
        this._poiEditorService.refreshPoiMarkers(this._map);
      });
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  /**
   * Get pois for the current subdomain
   */
  public getPois() {
    this._poiEditorService.getGTrackPois(this._map);
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
}
