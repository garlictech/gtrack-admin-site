import _cloneDeep from 'lodash-es/cloneDeep';
import _filter from 'lodash-es/filter';
import _pick from 'lodash-es/pick';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { debounceTime, filter, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { GeoSearchContextState, GeoSearchSelectors, PoiSelectors } from 'subrepos/gtrack-common-ngx';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EPoiTypes } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { select, Store } from '@ngrx/store';

import {
  ExternalPoi, ExternalPoiType, GooglePoi, GTrackPoi, OsmPoi, WikipediaPoi
} from '../../../../shared/interfaces';
import { PoiEditorService } from '../../../../shared/services';
import { RoutePlannerService } from '../../../../shared/services/admin-map';
import { State } from '../../../../store';
import { hikeEditPoiActions } from '../../../../store/actions';
import * as hikeEditPoiSelectors from '../../../../store/selectors/hike-edit-poi';
import * as hikeEditRoutePlannerSelectors from '../../../../store/selectors/hike-edit-route-planner';

@Component({
  selector: 'app-hike-edit-pois-external',
  templateUrl: './ui.html'
})
export class HikeEditPoisExternalComponent implements OnInit, OnDestroy {
  @Input() poiType: ExternalPoiType;
  @Input() isPlanning$: Observable<boolean>;
  pois$: Observable<Array<WikipediaPoi> | Array<GooglePoi> | Array<OsmPoi>>;
  segments$: Observable<any>;
  selectedPoisCount$: Observable<number>;
  loading$: Observable<boolean>;
  processing$: Observable<boolean>;
  saving$: Observable<boolean>;
  searchContext$: Observable<GeoSearchContextState | undefined>;
  showOnrouteMarkers: boolean;
  showOffrouteMarkers: boolean;
  modalPoi: WikipediaPoi | GooglePoi | OsmPoi;
  displayPoiModal: boolean;
  private readonly _destroy$: Subject<boolean>;

  constructor(
    private readonly _store: Store<State>,
    private readonly _routePlannerService: RoutePlannerService,
    private readonly _geoSearchSelectors: GeoSearchSelectors,
    private readonly _poiSelectors: PoiSelectors,
    private readonly _poiEditorService: PoiEditorService
  ) {
    this.showOnrouteMarkers = true;
    this.showOffrouteMarkers = true;
    this.displayPoiModal = false;

    this._destroy$ = new Subject<boolean>();
  }

  ngOnInit(): void {
    // Poi list from store
    this.pois$ = this._getSubdomainSelector(this.poiType.subdomain);

    // Route info from the store (for disabling GET buttons)
    this.segments$ = this._store.pipe(
      select(hikeEditRoutePlannerSelectors.getSegments),
      takeUntil(this._destroy$)
    );

    this.selectedPoisCount$ = this._store.pipe(
      select(hikeEditPoiSelectors.getSaveablePoisCount(this.poiType.subdomain)),
      takeUntil(this._destroy$)
    );

    // Update poi properties after poi list loaded
    this._store
      .pipe(
        select(hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector(this.poiType.subdomain, 'loaded')),
        takeUntil(this._destroy$),
        filter(loaded => !!loaded),
        switchMap(() => {
          this._store.dispatch(new hikeEditPoiActions.SetProcessing(this.poiType.subdomain, true));

          return combineLatest(
            this._getSubdomainSelector(this.poiType.subdomain).take(1),
            this._store.pipe(
              select(hikeEditRoutePlannerSelectors.getPath),
              take(1)
            )
          );
        }),
        filter(([pois, path]: [Array<ExternalPoi>, any]) => pois && pois.length > 0),
        switchMap(([pois, path]: [Array<ExternalPoi>, any]) => of(this._poiEditorService.organizePois(pois, path))),
        switchMap((pois: Array<ExternalPoi>) => this._poiEditorService.assignOnOffRoutePois(pois)),
        switchMap((pois: Array<ExternalPoi>) => this._poiEditorService.handleElevation(pois)),
        switchMap((pois: Array<ExternalPoi>) => this._poiEditorService.handlePoiDetails(pois, this.poiType.subdomain)),
        switchMap((pois: Array<ExternalPoi>) =>
          this._store.pipe(
            select(this._poiSelectors.getAllPois),
            take(1),
            map(gTrackPois => this._poiEditorService.handleGTrackPois(pois, gTrackPois))
          )
        ),
        takeUntil(this._destroy$),
        debounceTime(250)
      )
      .subscribe((pois: Array<ExternalPoi>) => {
        // Refresh poi list on the store
        this._updateSubdomainPois(pois);

        // Get gTrack pois for checking inGtrackDb
        if (pois.length > 0) {
          this._poiEditorService.getGTrackPois();
          this._poiEditorService.refreshPoiMarkers();
          // We have to refresh markers w/ empty poi list, too.
        } else {
          this._poiEditorService.refreshPoiMarkers();
        }

        this._store.dispatch(new hikeEditPoiActions.SetProcessing(this.poiType.subdomain, false));
      });

    // Update inGtrackDb properties after common poi list has been refreshed
    this._store
      .pipe(
        select(this._poiSelectors.getAllPois),
        debounceTime(250),
        filter((gTrackPois: Array<GTrackPoi>) => gTrackPois.length > 0),
        takeUntil(this._destroy$)
      )
      .subscribe((gTrackPois: Array<GTrackPoi>) => {
        // Saving in progress?
        this._store
          .pipe(
            select(hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector('collector', 'saving')),
            take(1)
          )
          .subscribe((saving: boolean) => {
            if (!saving) {
              this._getSubdomainSelector(this.poiType.subdomain)
                .pipe(
                  filter((externalPois: Array<ExternalPoi>) => externalPois.length > 0),
                  take(1)
                )
                .subscribe((externalPois: Array<ExternalPoi>) => {
                  this._setSubdomainPoisInGtrackDb(this._poiEditorService.handleGTrackPois(externalPois, gTrackPois));
                });
            }
          });
      });

    // Update inCollector properties after collected poi list has been refreshed
    this._store
      .pipe(
        select(hikeEditPoiSelectors.getAllCollectorPois),
        debounceTime(250),
        takeUntil(this._destroy$)
      )
      .subscribe((collectedPois: Array<any>) => {
        // Saving in progress?
        this._store
          .pipe(
            select(hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector('collector', 'saving')),
            take(1)
          )
          .subscribe((saving: boolean) => {
            if (!saving) {
              this._getSubdomainSelector(this.poiType.subdomain)
                .pipe(
                  filter((externalPois: Array<ExternalPoi>) => externalPois.length > 0),
                  take(1)
                )
                .subscribe((externalPois: Array<ExternalPoi>) => {
                  this._setSubdomainPoisInCollector(
                    this._poiEditorService.handleInCollectorPois(externalPois, collectedPois)
                  );

                  this._poiEditorService.refreshPoiMarkers();
                });
            }
          });
      });

    //
    // Contexts
    //

    this.loading$ = this._store.pipe(
      select(hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector(this.poiType.subdomain, 'loading')),
      takeUntil(this._destroy$)
    );

    this.processing$ = this._store.pipe(
      select(hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector(this.poiType.subdomain, 'processing')),
      takeUntil(this._destroy$)
    );

    this.saving$ = this._store.pipe(
      select(hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector(this.poiType.subdomain, 'saving')),
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
          hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector(this.poiType.subdomain, 'showOnrouteMarkers')
        ),
        takeUntil(this._destroy$),
        debounceTime(250)
      )
      .subscribe((value: boolean) => {
        this.showOnrouteMarkers = value;
        this.isPlanning$.pipe(take(1)).subscribe((isPlanning: boolean) => {
          if (isPlanning) {
            this._poiEditorService.refreshPoiMarkers();
          }
        });
      });

    this._store
      .pipe(
        select(
          hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector(this.poiType.subdomain, 'showOffrouteMarkers')
        ),
        takeUntil(this._destroy$),
        debounceTime(250)
      )
      .subscribe((value: boolean) => {
        this.showOffrouteMarkers = value;
        this.isPlanning$.pipe(take(1)).subscribe((isPlanning: boolean) => {
          if (isPlanning) {
            this._poiEditorService.refreshPoiMarkers();
          }
        });
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  /**
   * Get pois for the current subdomain
   */
  getPois(): void {
    const _bounds = this._routePlannerService.getSearchBounds();

    if (_bounds) {
      // Get pois for the current domain
      this._store.dispatch(new hikeEditPoiActions[this.poiType.getAction](_bounds));
    }
  }

  /**
   * Show onroute markers checkbox click
   */
  toggleOnrouteMarkers(): void {
    this._store.dispatch(new hikeEditPoiActions.ToggleOnrouteMarkers(this.poiType.subdomain));
  }

  /**
   * Show offroute markers checkbox click
   */
  toggleOffrouteMarkers(): void {
    this._store.dispatch(new hikeEditPoiActions.ToggleOffrouteMarkers(this.poiType.subdomain));
  }

  /**
   * Copy selected pois to collector
   */
  copyToPoiCollector(): void {
    this.pois$.pipe(take(1)).subscribe((pois: Array<ExternalPoi>) => {
      const _externalPoisToAdd = _filter(pois, (poi: ExternalPoi) => !!(poi.selected && !poi.inGtrackDb));

      this._store.dispatch(new hikeEditPoiActions.AddPoisToCollector(_externalPoisToAdd));
    });
  }

  // tslint:disable-next-line:no-property-initializers
  openPoiModal = poi => {
    this.modalPoi = _cloneDeep(poi);
    this.displayPoiModal = true;
  };

  private _getSubdomainSelector(subdomain: string): any {
    let _pois$;

    switch (subdomain) {
      case EPoiTypes.google:
        _pois$ = this._store.pipe(select(hikeEditPoiSelectors.getAllGooglePois));
        break;
      case EPoiTypes.wikipedia:
        _pois$ = this._store.pipe(select(hikeEditPoiSelectors.getAllWikipediaPois));
        break;
      case EPoiTypes.osmAmenity:
        _pois$ = this._store.pipe(select(hikeEditPoiSelectors.getAllOsmAmenityPois));
        break;
      case EPoiTypes.osmNatural:
        _pois$ = this._store.pipe(select(hikeEditPoiSelectors.getAllOsmNaturalPois));
        break;
      case EPoiTypes.osmRoute:
        _pois$ = this._store.pipe(select(hikeEditPoiSelectors.getAllOsmRoutePois));
        break;
      default:
        break;
    }

    return _pois$.pipe(
      takeUntil(this._destroy$),
      debounceTime(250)
    );
  }

  private _updateSubdomainPois(pois): void {
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
      default:
        break;
    }
  }

  private _setSubdomainPoisInGtrackDb(pois): void {
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
      default:
        break;
    }
  }

  private _setSubdomainPoisInCollector(pois): void {
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
      default:
        break;
    }
  }
}
