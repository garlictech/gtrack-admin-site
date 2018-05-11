
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AdminMap, AdminMapService, AdminMapMarker, RoutePlannerService } from 'app/shared/services/admin-map';
import { PoiEditorService } from 'app/shared/services';
import { Poi, PoiSelectors } from 'subrepos/gtrack-common-ngx';
import { IPoi } from 'subrepos/provider-client';
import {
  IExternalPoiType, IExternalPoi, IWikipediaPoi, IGooglePoi, IOsmPoi, IGTrackPoi
} from 'app/shared/interfaces';
import {
  State, hikeEditPoiActions, IExternalPoiListContextState, commonPoiActions, IHikeEditRoutePlannerState
} from 'app/store';
import { HikeEditMapSelectors, HikeEditPoiSelectors, HikeEditRoutePlannerSelectors } from 'app/store/selectors'

import * as _ from 'lodash';

@Component({
  selector: 'gt-hike-edit-pois-external',
  templateUrl: './ui.html'
})
export class HikeEditPoisExternalComponent implements OnInit, OnDestroy {
  @Input() poiType: IExternalPoiType;
  public pois$: Observable<IWikipediaPoi[] | IGooglePoi[] | IOsmPoi[]>;
  public routePath$: Observable<any>;
  public loading$: Observable<boolean>;
  public showOnrouteMarkers$: Observable<boolean>;
  public showOffrouteMarkers$: Observable<boolean>;
  private _map: AdminMap;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _adminMapService: AdminMapService,
    private _routePlannerService: RoutePlannerService,
    private _hikeEditMapSelectors: HikeEditMapSelectors,
    private _hikeEditPoiSelectors: HikeEditPoiSelectors,
    private _poiSelectors: PoiSelectors,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _poiEditorService: PoiEditorService
  ) {}

  ngOnInit() {
    this._store
      .select(this._hikeEditMapSelectors.getMapId)
      .filter(id => id !== '')
      .takeUntil(this._destroy$)
      .subscribe((mapId: string) => {
        this._map = this._adminMapService.getMapById(mapId);
      });

    // Poi list from store
    this.pois$ = this._getSubdomainSelector(this.poiType.subdomain);

    // Route info from the store (for disabling GET buttons)
    this.routePath$ = this._store
      .select(this._hikeEditRoutePlannerSelectors.getPath)
      .takeUntil(this._destroy$);

    // Update poi properties after poi list loaded
    this._store
      .select(this._hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector(this.poiType.subdomain, 'loaded'))
      .filter(loaded => !!loaded)
      .switchMap(() => Observable.combineLatest(
        this._getSubdomainSelector(this.poiType.subdomain).take(1),
        this._store.select(this._hikeEditRoutePlannerSelectors.getPath).take(1)
      ))
      .filter(([pois, path]: [IExternalPoi[], any]) => (pois && pois.length > 0))
      .switchMap(([pois, path]: [IExternalPoi[], any]) => {
        return Observable.of(this._poiEditorService.organizePois(pois, path));
      })
      .switchMap((pois: IExternalPoi[]) => this._poiEditorService.assignOnOffRoutePois(pois))
      .switchMap((pois: IExternalPoi[]) => this._poiEditorService.handleElevation(pois))
      .switchMap((pois: IExternalPoi[]) => {
        return this._store
          .select(this._poiSelectors.getAllPois)
          .take(1)
          .map((gTrackPois) => {
            return this._poiEditorService.handleGTrackPois(pois, gTrackPois);
          });
      })
      .takeUntil(this._destroy$)
      .subscribe((pois) => {
        // Refresh poi list on the store
        this._updateSubdomainPois(pois);

        // Get gTrack pois for checking inGtrackDb
        if (pois.length > 0) {
          // gTrack poi will call marker refresher!
          this._poiEditorService.getGTrackPois(this._map);
        // We have to refresh markers w/ empty poi list, too.
        } else {
          this._poiEditorService.refreshPoiMarkers(this._map);
        }
      });

    // Update inGtrackDb properties after common poi list has been refreshed
    this._store
      .select(this._poiSelectors.getAllPois)
      .debounceTime(200)
      .filter((gTrackPois: IGTrackPoi[]) => gTrackPois.length > 0)
      .takeUntil(this._destroy$)
      .subscribe((gTrackPois: IGTrackPoi[]) => {
        this._getSubdomainSelector(this.poiType.subdomain)
          .filter((externalPois: IExternalPoi[]) => externalPois.length > 0)
          .take(1)
          .subscribe((externalPois: IExternalPoi[]) => {
            this._setSubdomainPoisInGtrackDb(this._poiEditorService.handleGTrackPois(externalPois, gTrackPois));
          });
      });

    //
    // Contexts
    //

    this.loading$ = this._store
      .select(this._hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector(this.poiType.subdomain, 'loading'))
      .takeUntil(this._destroy$);

    this.showOnrouteMarkers$ = this._store
      .select(this._hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector(this.poiType.subdomain, 'showOnrouteMarkers'))
      .takeUntil(this._destroy$);

    this.showOffrouteMarkers$ = this._store
      .select(this._hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector(this.poiType.subdomain, 'showOffrouteMarkers'))
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

  private _getSubdomainSelector(subdomain: string) {
    let _pois$;

    switch (subdomain) {
      case 'google':
        _pois$ = this._store.select(this._hikeEditPoiSelectors.getAllGooglePois); break;
      case 'wikipedia':
        _pois$ = this._store.select(this._hikeEditPoiSelectors.getAllWikipediaPois); break;
      case 'osmAmenity':
        _pois$ = this._store.select(this._hikeEditPoiSelectors.getAllOsmAmenityPois); break;
      case 'osmNatural':
        _pois$ = this._store.select(this._hikeEditPoiSelectors.getAllOsmNaturalPois); break;
      case 'osmRoute':
        _pois$ = this._store.select(this._hikeEditPoiSelectors.getAllOsmRoutePois); break;
    }

    return _pois$.takeUntil(this._destroy$);
  }

  private _updateSubdomainPois(pois) {
    switch (this.poiType.subdomain) {
      case 'google':
        this._store.dispatch(new hikeEditPoiActions.SetGooglePois({ pois: pois })); break;
      case 'wikipedia':
        this._store.dispatch(new hikeEditPoiActions.SetWikipediaPois({ pois: pois })); break;
      case 'osmAmenity':
        this._store.dispatch(new hikeEditPoiActions.SetOsmAmenityPois({ pois: pois })); break;
      case 'osmNatural':
        this._store.dispatch(new hikeEditPoiActions.SetOsmNaturalPois({ pois: pois })); break;
      case 'osmRoute':
        this._store.dispatch(new hikeEditPoiActions.SetOsmRoutePois({ pois: pois })); break;
    }
  }

  private _setSubdomainPoisInGtrackDb(pois) {
    switch (this.poiType.subdomain) {
      case 'google':
        this._store.dispatch(new hikeEditPoiActions.SetGooglePoisInGtrackDb({
          properties: pois.map(p => _.pick(p, ['id', 'inGtrackDb']))
        }));
        break;
      case 'wikipedia':
        this._store.dispatch(new hikeEditPoiActions.SetWikipediaPoisInGtrackDb({
          properties: pois.map(p => _.pick(p, ['id', 'inGtrackDb']))
        }));
        break;
      case 'osmAmenity':
        this._store.dispatch(new hikeEditPoiActions.SetOsmAmenityPoisInGtrackDb({
          properties: pois.map(p => _.pick(p, ['id', 'inGtrackDb']))
        }));
        break;
      case 'osmNatural':
        this._store.dispatch(new hikeEditPoiActions.SetOsmNaturalPoisInGtrackDb({
          properties: pois.map(p => _.pick(p, ['id', 'inGtrackDb']))
        }));
        break;
      case 'osmRoute':
        this._store.dispatch(new hikeEditPoiActions.SetOsmRoutePoisInGtrackDb({
          properties: pois.map(p => _.pick(p, ['id', 'inGtrackDb']))
        }));
        break;
    }
  }

  /**
   * Get pois for the current subdomain
   */
  public getPois() {
    let _bounds = this._routePlannerService.getSearchBounds();

    if (_bounds) {
      // Get pois for the current domain
      this._store.dispatch(new hikeEditPoiActions[this.poiType.getAction]({
        bounds: _bounds,
        mapId: this._map.id
      }));
    }
  }

  /**
   * Show onroute markers checkbox click
   */
  public toggleOnrouteMarkers() {
    this._store.dispatch(
      new hikeEditPoiActions.ToggleOnrouteMarkers({ subdomain: this.poiType.subdomain })
    );
  }

  /**
   * Show offroute markers checkbox click
   */
  public toggleOffrouteMarkers() {
    this._store.dispatch(
      new hikeEditPoiActions.ToggleOffrouteMarkers({ subdomain: this.poiType.subdomain })
    );
  }

  /**
   * Save inHike pois as gTrackPoi
   */
  public savePois() {
    this.pois$
      .take(1)
      .subscribe((pois: IExternalPoi[]) => {
        const _externalPoisToSave = _.filter(pois, (poi: IExternalPoi) => {
          return (!!(poi.inHike && !poi.inGtrackDb));
        });

        for (let externalPoi of _externalPoisToSave) {
          let _poiData = this._poiEditorService.getDbObj(externalPoi);

          this._store.dispatch(new commonPoiActions.SavePoi(_poiData));
        }
      });
  }
}
