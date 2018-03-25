
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AdminMap, AdminMapService, AdminMapMarker } from 'app/shared/services/admin-map';
import { PoiEditorService } from 'app/shared/services';
import { Poi, PoiSelectors } from 'subrepos/gtrack-common-ngx';
import { IPoi } from 'subrepos/provider-client';
import {
  IExternalPoiType, IExternalPoi, IWikipediaPoi, IGooglePoi, IOsmPoi
} from 'app/shared/interfaces';
import {
  State, hikeEditPoiActions, IExternalPoiListContextState, commonPoiActions
} from 'app/store';
import { HikeEditMapSelectors, HikeEditPoiSelectors } from 'app/store/selectors'

import * as _ from 'lodash';

@Component({
  selector: 'gt-hike-edit-pois-external',
  templateUrl: './hike-edit-pois-external.component.html'
})
export class HikeEditPoisExternalComponent implements OnInit, OnDestroy {
  @Input() poiType: IExternalPoiType;
  public pois$: Observable<IWikipediaPoi[] | IGooglePoi[] | IOsmPoi[]>;
  public loading$: Observable<boolean>;
  public showOnrouteMarkers$: Observable<boolean>;
  public showOffrouteMarkers$: Observable<boolean>;
  private _map: AdminMap;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _adminMapService: AdminMapService,
    private _hikeEditMapSelectors: HikeEditMapSelectors,
    private _hikeEditPoiSelectors: HikeEditPoiSelectors,
    private _poiSelectors: PoiSelectors,
    private _poiEditorService: PoiEditorService
  ) {}

  ngOnInit() {
    this._store
      .select(this._hikeEditMapSelectors.getMapId)
      .filter(id => id !== '')
      .take(1)
      .subscribe((mapId: string) => {
        this._map = this._adminMapService.getMapById(mapId);
      });

    // Poi list from store
    this.pois$ = this._getSubdomainSelector(this.poiType.subdomain);

    // Update poi properties after poi list loaded
    this._store
      .select(this._hikeEditPoiSelectors.getHikeEditContextPropertySelector(this.poiType.subdomain, 'loaded'))
      .takeUntil(this._destroy$)
      .filter(loaded => !!loaded)
      .subscribe((loaded: boolean) => {
        // We have pure poi list on the store, now we have update some property
        this._getSubdomainSelector(this.poiType.subdomain)
          .take(1)
          .switchMap((pois: IExternalPoi[]) => this._poiEditorService.organizePois(pois, this._map.routeInfo.getPath()))
          .switchMap((pois: IExternalPoi[]) => this._poiEditorService.assignOnOffRoutePois(pois))
          .switchMap((pois: IExternalPoi[]) => this._poiEditorService.handleElevation(pois))
          .subscribe((pois) => {
            // Refresh poi list on the store
            this._updateSubdomainPois(pois);

            // Refresh markers
            this._poiEditorService.refreshPoiMarkers(this._map);

            // Get gTrack pois for checking inGtrackDb
            this._poiEditorService.getGTrackPois(this._map);
          });
      });

    // Update inGtrackDb properties after common poi list has been refreshed
    this._store.select(this._poiSelectors.getAllPois)
      .takeUntil(this._destroy$)
      .subscribe((gTRackPois) => {
        this._getSubdomainSelector(this.poiType.subdomain)
          .take(1)
          .subscribe((pois) => {
            this._patchSubdomainPois(this._poiEditorService.handleGTrackPois(pois, gTRackPois), ['id', 'inGtrackDb']);
          });
      });

    //
    // Contexts
    //

    this.loading$ = this._store
      .select(this._hikeEditPoiSelectors.getHikeEditContextPropertySelector(this.poiType.subdomain, 'loading'));

    this.showOnrouteMarkers$ = this._store
      .select(this._hikeEditPoiSelectors.getHikeEditContextPropertySelector(this.poiType.subdomain, 'showOnrouteMarkers'));

    this.showOffrouteMarkers$ = this._store
      .select(this._hikeEditPoiSelectors.getHikeEditContextPropertySelector(this.poiType.subdomain, 'showOffrouteMarkers'));

    //
    // Refresh markers
    //

    this.showOnrouteMarkers$.takeUntil(this._destroy$).subscribe(() => {
      this._poiEditorService.refreshPoiMarkers(this._map);
    });
    this.showOffrouteMarkers$.takeUntil(this._destroy$).subscribe(() => {
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

    return _pois$;
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

  private _patchSubdomainPois(pois, props: string[]) {
    switch (this.poiType.subdomain) {
      case 'google':
        this._store.dispatch(new hikeEditPoiActions.SetGooglePois({ pois: pois })); break;
      case 'wikipedia':
        this._store.dispatch(new hikeEditPoiActions.SetWikipediaPois({ pois: pois })); break;
      case 'osmAmenity':
        this._store.dispatch(new hikeEditPoiActions.SetOsmAmenityPois({ pois: pois })); break;
      case 'osmNatural':
        this._store.dispatch(new hikeEditPoiActions.PatchOsmNaturalPois({
          properties: pois.map(p => _.pick(p, props))
        }));
        break;
      case 'osmRoute':
        this._store.dispatch(new hikeEditPoiActions.SetOsmRoutePois({ pois: pois })); break;
    }
  }

  /**
   * Get pois for the current subdomain
   */
  public getPois() {
    let _bounds = this._map.routeInfo.getSearchBounds();

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
