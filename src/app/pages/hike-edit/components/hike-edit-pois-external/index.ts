import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subject, of, combineLatest } from 'rxjs';
import { filter, takeUntil, switchMap, take, map, debounceTime } from 'rxjs/operators';
import { AdminMap, AdminMapService, RoutePlannerService } from '../../../../shared/services/admin-map';
import { PoiEditorService } from '../../../../shared/services';
import { PoiSelectors, IGeoSearchContextState, GeoSearchSelectors } from 'subrepos/gtrack-common-ngx';
import { EPoiTypes } from 'subrepos/provider-client';
import {
  IExternalPoiType,
  IExternalPoi,
  IWikipediaPoi,
  IGooglePoi,
  IOsmPoi,
  IGTrackPoi
} from '../../../../shared/interfaces';
import { State } from '../../../../store';
import { hikeEditPoiActions } from '../../../../store/actions';
import { HikeEditMapSelectors, HikeEditPoiSelectors, HikeEditRoutePlannerSelectors } from '../../../../store/selectors';

import _pick from 'lodash-es/pick';
import _filter from 'lodash-es/filter';
import _cloneDeep from 'lodash-es/cloneDeep';

@Component({
  selector: 'app-hike-edit-pois-external',
  templateUrl: './ui.html'
})
export class HikeEditPoisExternalComponent implements OnInit, OnDestroy {
  @Input() poiType: IExternalPoiType;
  @Input() isPlanning$: Observable<boolean>;
  public pois$: Observable<IWikipediaPoi[] | IGooglePoi[] | IOsmPoi[]>;
  public segments$: Observable<any>;
  public selectedPoisCount$: Observable<number>;
  public loading$: Observable<boolean>;
  public processing$: Observable<boolean>;
  public saving$: Observable<boolean>;
  public searchContext$: Observable<IGeoSearchContextState | undefined>;
  public showOnrouteMarkers = true;
  public showOffrouteMarkers = true;
  public modalPoi: IWikipediaPoi | IGooglePoi | IOsmPoi;
  public displayPoiModal = false;
  private _map: AdminMap;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _adminMapService: AdminMapService,
    private _routePlannerService: RoutePlannerService,
    private _hikeEditMapSelectors: HikeEditMapSelectors,
    private _hikeEditPoiSelectors: HikeEditPoiSelectors,
    private _geoSearchSelectors: GeoSearchSelectors,
    private _poiSelectors: PoiSelectors,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _poiEditorService: PoiEditorService
  ) {}

  ngOnInit() {
    this._store
      .pipe(
        select(this._hikeEditMapSelectors.getMapId),
        filter(id => id !== ''),
        takeUntil(this._destroy$)
      )
      .subscribe((mapId: string) => {
        this._map = this._adminMapService.getMapById(mapId);
      });

    // Poi list from store
    this.pois$ = this._getSubdomainSelector(this.poiType.subdomain);

    // Route info from the store (for disabling GET buttons)
    this.segments$ = this._store.pipe(
      select(this._hikeEditRoutePlannerSelectors.getSegments),
      takeUntil(this._destroy$)
    );

    this.selectedPoisCount$ = this._store.pipe(
      select(this._hikeEditPoiSelectors.getSaveablePoisCount(this.poiType.subdomain)),
      takeUntil(this._destroy$)
    );

    // Update poi properties after poi list loaded
    this._store
      .pipe(
        select(this._hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector(this.poiType.subdomain, 'loaded')),
        takeUntil(this._destroy$),
        filter(loaded => !!loaded),
        switchMap(() => {
          this._store.dispatch(new hikeEditPoiActions.SetProcessing(this.poiType.subdomain, true));

          return combineLatest(
            this._getSubdomainSelector(this.poiType.subdomain).take(1),
            this._store.pipe(
              select(this._hikeEditRoutePlannerSelectors.getPath),
              take(1)
            )
          );
        }),
        filter(([pois, path]: [IExternalPoi[], any]) => pois && pois.length > 0),
        switchMap(([pois, path]: [IExternalPoi[], any]) => of(this._poiEditorService.organizePois(pois, path))),
        switchMap((pois: IExternalPoi[]) => this._poiEditorService.assignOnOffRoutePois(pois)),
        switchMap((pois: IExternalPoi[]) => this._poiEditorService.handleElevation(pois)),
        switchMap((pois: IExternalPoi[]) => this._poiEditorService.handlePoiDetails(pois, this.poiType.subdomain)),
        switchMap((pois: IExternalPoi[]) => {
          return this._store.pipe(
            select(this._poiSelectors.getAllPois),
            take(1),
            map(gTrackPois => {
              return this._poiEditorService.handleGTrackPois(pois, gTrackPois);
            })
          );
        }),
        takeUntil(this._destroy$),
        debounceTime(250)
      )
      .subscribe((pois: IExternalPoi[]) => {
        // Refresh poi list on the store
        this._updateSubdomainPois(pois);

        // Get gTrack pois for checking inGtrackDb
        if (pois.length > 0) {
          this._poiEditorService.getGTrackPois();
          this._poiEditorService.refreshPoiMarkers(this._map);
          // We have to refresh markers w/ empty poi list, too.
        } else {
          this._poiEditorService.refreshPoiMarkers(this._map);
        }

        this._store.dispatch(new hikeEditPoiActions.SetProcessing(this.poiType.subdomain, false));
      });

    // Update inGtrackDb properties after common poi list has been refreshed
    this._store
      .pipe(
        select(this._poiSelectors.getAllPois),
        debounceTime(250),
        filter((gTrackPois: IGTrackPoi[]) => gTrackPois.length > 0),
        takeUntil(this._destroy$)
      )
      .subscribe((gTrackPois: IGTrackPoi[]) => {
        // Saving in progress?
        this._store
          .pipe(
            select(this._hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector('collector', 'saving')),
            take(1)
          )
          .subscribe((saving: boolean) => {
            if (!saving) {
              this._getSubdomainSelector(this.poiType.subdomain)
                .pipe(
                  filter((externalPois: IExternalPoi[]) => externalPois.length > 0),
                  take(1)
                )
                .subscribe((externalPois: IExternalPoi[]) => {
                  this._setSubdomainPoisInGtrackDb(this._poiEditorService.handleGTrackPois(externalPois, gTrackPois));
                });
            }
          });
      });

    // Update inCollector properties after collected poi list has been refreshed
    this._store
      .pipe(
        select(this._hikeEditPoiSelectors.getAllCollectorPois),
        debounceTime(250),
        takeUntil(this._destroy$)
      )
      .subscribe((collectedPois: any[]) => {
        // Saving in progress?
        this._store
          .pipe(
            select(this._hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector('collector', 'saving')),
            take(1)
          )
          .subscribe((saving: boolean) => {
            if (!saving) {
              this._getSubdomainSelector(this.poiType.subdomain)
                .pipe(
                  filter((externalPois: IExternalPoi[]) => externalPois.length > 0),
                  take(1)
                )
                .subscribe((externalPois: IExternalPoi[]) => {
                  this._setSubdomainPoisInCollector(
                    this._poiEditorService.handleInCollectorPois(externalPois, collectedPois)
                  );

                  this._poiEditorService.refreshPoiMarkers(this._map);
                });
            }
          });
      });

    //
    // Contexts
    //

    this.loading$ = this._store.pipe(
      select(this._hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector(this.poiType.subdomain, 'loading')),
      takeUntil(this._destroy$)
    );

    this.processing$ = this._store.pipe(
      select(this._hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector(this.poiType.subdomain, 'processing')),
      takeUntil(this._destroy$)
    );

    this.saving$ = this._store.pipe(
      select(this._hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector(this.poiType.subdomain, 'saving')),
      takeUntil(this._destroy$)
    );

    this.searchContext$ = this._store.pipe(
      select(this._geoSearchSelectors.getGeoSearchContext('gTrackPois')),
      takeUntil(this._destroy$)
    );

    //
    // Refresh markers
    //

    this._store
      .pipe(
        select(
          this._hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector(this.poiType.subdomain, 'showOnrouteMarkers')
        ),
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
        select(
          this._hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector(
            this.poiType.subdomain,
            'showOffrouteMarkers'
          )
        ),
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

  private _getSubdomainSelector(subdomain: string) {
    let _pois$;

    switch (subdomain) {
      case EPoiTypes.google:
        _pois$ = this._store.pipe(select(this._hikeEditPoiSelectors.getAllGooglePois));
        break;
      case EPoiTypes.wikipedia:
        _pois$ = this._store.pipe(select(this._hikeEditPoiSelectors.getAllWikipediaPois));
        break;
      case EPoiTypes.osmAmenity:
        _pois$ = this._store.pipe(select(this._hikeEditPoiSelectors.getAllOsmAmenityPois));
        break;
      case EPoiTypes.osmNatural:
        _pois$ = this._store.pipe(select(this._hikeEditPoiSelectors.getAllOsmNaturalPois));
        break;
      case EPoiTypes.osmRoute:
        _pois$ = this._store.pipe(select(this._hikeEditPoiSelectors.getAllOsmRoutePois));
        break;
    }

    return _pois$.pipe(
      takeUntil(this._destroy$),
      debounceTime(250)
    );
  }

  private _updateSubdomainPois(pois) {
    switch (this.poiType.subdomain) {
      case EPoiTypes.google:
        this._store.dispatch(new hikeEditPoiActions.SetGooglePois(pois));
        break;
      case EPoiTypes.wikipedia:
        this._store.dispatch(new hikeEditPoiActions.SetWikipediaPois(pois));
        break;
      case EPoiTypes.osmAmenity:
        this._store.dispatch(new hikeEditPoiActions.SetOsmAmenityPois(pois));
        break;
      case EPoiTypes.osmNatural:
        this._store.dispatch(new hikeEditPoiActions.SetOsmNaturalPois(pois));
        break;
      case EPoiTypes.osmRoute:
        this._store.dispatch(new hikeEditPoiActions.SetOsmRoutePois(pois));
        break;
    }
  }

  private _setSubdomainPoisInGtrackDb(pois) {
    switch (this.poiType.subdomain) {
      case EPoiTypes.google:
        this._store.dispatch(
          new hikeEditPoiActions.SetGooglePoisInGtrackDb(pois.map(p => _pick(p, ['id', 'inGtrackDb'])))
        );
        break;
      case EPoiTypes.wikipedia:
        this._store.dispatch(
          new hikeEditPoiActions.SetWikipediaPoisInGtrackDb(pois.map(p => _pick(p, ['id', 'inGtrackDb'])))
        );
        break;
      case EPoiTypes.osmAmenity:
        this._store.dispatch(
          new hikeEditPoiActions.SetOsmAmenityPoisInGtrackDb(pois.map(p => _pick(p, ['id', 'inGtrackDb'])))
        );
        break;
      case EPoiTypes.osmNatural:
        this._store.dispatch(
          new hikeEditPoiActions.SetOsmNaturalPoisInGtrackDb(pois.map(p => _pick(p, ['id', 'inGtrackDb'])))
        );
        break;
      case EPoiTypes.osmRoute:
        this._store.dispatch(
          new hikeEditPoiActions.SetOsmRoutePoisInGtrackDb(pois.map(p => _pick(p, ['id', 'inGtrackDb'])))
        );
        break;
    }
  }

  private _setSubdomainPoisInCollector(pois) {
    switch (this.poiType.subdomain) {
      case EPoiTypes.google:
        this._store.dispatch(
          new hikeEditPoiActions.SetGooglePoisInCollector(pois.map(p => _pick(p, ['id', 'inCollector'])))
        );
        break;
      case EPoiTypes.wikipedia:
        this._store.dispatch(
          new hikeEditPoiActions.SetWikipediaPoisInCollector(pois.map(p => _pick(p, ['id', 'inCollector'])))
        );
        break;
      case EPoiTypes.osmAmenity:
        this._store.dispatch(
          new hikeEditPoiActions.SetOsmAmenityPoisInCollector(pois.map(p => _pick(p, ['id', 'inCollector'])))
        );
        break;
      case EPoiTypes.osmNatural:
        this._store.dispatch(
          new hikeEditPoiActions.SetOsmNaturalPoisInCollector(pois.map(p => _pick(p, ['id', 'inCollector'])))
        );
        break;
      case EPoiTypes.osmRoute:
        this._store.dispatch(
          new hikeEditPoiActions.SetOsmRoutePoisInCollector(pois.map(p => _pick(p, ['id', 'inCollector'])))
        );
        break;
    }
  }

  /**
   * Get pois for the current subdomain
   */
  public getPois() {
    const _bounds = this._routePlannerService.getSearchBounds();

    if (_bounds) {
      // Get pois for the current domain
      this._store.dispatch(new hikeEditPoiActions[this.poiType.getAction](_bounds, this._map.id));
    }
  }

  /**
   * Show onroute markers checkbox click
   */
  public toggleOnrouteMarkers() {
    this._store.dispatch(new hikeEditPoiActions.ToggleOnrouteMarkers(this.poiType.subdomain));
  }

  /**
   * Show offroute markers checkbox click
   */
  public toggleOffrouteMarkers() {
    this._store.dispatch(new hikeEditPoiActions.ToggleOffrouteMarkers(this.poiType.subdomain));
  }

  /**
   * Copy selected pois to collector
   */
  public copyToPoiCollector() {
    this.pois$.pipe(take(1)).subscribe((pois: IExternalPoi[]) => {
      const _externalPoisToAdd = _filter(pois, (poi: IExternalPoi) => {
        return !!(poi.selected && !poi.inGtrackDb);
      });

      this._store.dispatch(new hikeEditPoiActions.AddPoisToCollector(_externalPoisToAdd));
    });
  }

  public openPoiModal = poi => {
    this.modalPoi = _cloneDeep(poi);
    this.displayPoiModal = true;
  }
}
