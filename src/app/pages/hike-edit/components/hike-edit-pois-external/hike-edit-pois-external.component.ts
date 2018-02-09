
import { Component, Input, Injector, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AdminMap, AdminMapService, AdminMapMarker } from 'app/shared/services/admin-map';
import { PoiEditorService } from 'app/shared/services';
import { ExternalPoi } from 'app/shared/services/poi/lib';
import { Poi } from 'subrepos/gtrack-common-ngx';
import { IPoi } from 'subrepos/provider-client';
import { IExternalPoiType, IExternalPoi, IWikipediaPoi, IGooglePoi, IOsmPoi } from 'app/shared/interfaces';
import {
  State, hikeEditPoiActions, IExternalPoiListContextState, commonPoiActions,
} from 'app/store';
import { HikeEditMapSelectors } from 'app/store/selectors/hike-edit-map';
import { HikeEditPoiSelectors } from 'app/store/selectors/hike-edit-poi';

import * as _ from 'lodash';

@Component({
  selector: 'gt-hike-edit-pois-external',
  templateUrl: './hike-edit-pois-external.component.html'
})
export class HikeEditPoisExternalComponent implements OnInit, OnDestroy {
  @Input() poiType: IExternalPoiType;
  public pois$: Observable<IWikipediaPoi[] | IGooglePoi[] | IOsmPoi[]>;
  public markers$: Observable<AdminMapMarker[]>;
  public loading$: Observable<boolean>;
  public showOnrouteMarkers$: Observable<boolean>;
  public showOffrouteMarkers$: Observable<boolean>;
  private _map: AdminMap;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _injector: Injector,
    private _store: Store<State>,
    private _adminMapService: AdminMapService,
    private _hikeEditMapSelectors: HikeEditMapSelectors,
    private _hikeEditPoiSelectors: HikeEditPoiSelectors,
    private _poiEditorService: PoiEditorService
  ) {}

  ngOnInit() {
    this._store.select(this._hikeEditMapSelectors.getHikeEditMapMapIdSelector())
      .subscribe((mapId: string) => {
        this._map = this._adminMapService.getMapById(mapId);
      });

    switch (this.poiType.subdomain) {
      case 'google':
        this.pois$ = this._store.select(this._hikeEditPoiSelectors.getAllGooglePois);
        this.markers$ = this._store.select(this._hikeEditMapSelectors.getAllGoogleMarkers);
        break;
      case 'wikipedia':
        this.pois$ = this._store.select(this._hikeEditPoiSelectors.getAllWikipediaPois);
        this.markers$ = this._store.select(this._hikeEditMapSelectors.getAllWikipediaMarkers);
        break;
      case 'osmAmenity':
        this.pois$ = this._store.select(this._hikeEditPoiSelectors.getAllOsmAmenityPois);
        this.markers$ = this._store.select(this._hikeEditMapSelectors.getAllOsmAmenityMarkers);
        break;
      case 'osmNatural':
        this.pois$ = this._store.select(this._hikeEditPoiSelectors.getAllOsmNaturalPois);
        this.markers$ = this._store.select(this._hikeEditMapSelectors.getAllOsmNaturalMarkers);
        break;
      case 'osmRoute':
        this.pois$ = this._store.select(this._hikeEditPoiSelectors.getAllOsmRoutePois);
        this.markers$ = this._store.select(this._hikeEditMapSelectors.getAllOsmRouteMarkers);
        break;
    }

    this.pois$
      .takeUntil(this._destroy$)
      .subscribe((pois) => {
        // Refresh markers when the poi list has been changed
        this._store.dispatch(new hikeEditPoiActions.GenerateSubdomainPoiMarkers({
          subdomain: this.poiType.subdomain
        }));
      });

    this.markers$
      .takeUntil(this._destroy$)
      .subscribe((markers) => {
        this._store.dispatch(new hikeEditPoiActions.MarkersConfigChanged({
          subdomain: this.poiType.subdomain
        }));
      });

    this.loading$ = this._store.select(
      this._hikeEditPoiSelectors.getHikeEditContextPropertySelector(
        this.poiType.subdomain, 'loading'));

    this.showOnrouteMarkers$ = this._store.select(
      this._hikeEditPoiSelectors.getHikeEditContextPropertySelector(
        this.poiType.subdomain, 'showOnrouteMarkers'));

    this.showOffrouteMarkers$ = this._store.select(
      this._hikeEditPoiSelectors.getHikeEditContextPropertySelector(
        this.poiType.subdomain, 'showOffrouteMarkers'));

    this.showOnrouteMarkers$
      .takeUntil(this._destroy$)
      .subscribe(() => {
        this._store.dispatch(new hikeEditPoiActions.MarkersConfigChanged({
          subdomain: this.poiType.subdomain
        }));
      });

    this.showOffrouteMarkers$
      .takeUntil(this._destroy$)
      .subscribe(() => {
        this._store.dispatch(new hikeEditPoiActions.MarkersConfigChanged({
          subdomain: this.poiType.subdomain
        }));
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
    this._store.dispatch(new hikeEditPoiActions.ToggleOnrouteMarkers({
      subdomain: this.poiType.subdomain
    }));
  }

  /**
   * Show offroute markers checkbox click
   */
  public toggleOffrouteMarkers() {
    this._store.dispatch(new hikeEditPoiActions.ToggleOffrouteMarkers({
      subdomain: this.poiType.subdomain
    }));
  }

  /**
   * Save inHike pois as gTrackPoi
   */

  public savePois() {
    this.pois$
      .take(1)
      .subscribe((pois: IExternalPoi[]) => {
        const _externalPoisToSave = _.filter(pois, (poi: IExternalPoi) => (!!(poi.inHike && !poi.inGtrackDb)));
        let _poisToSave: Poi[] = [];

        for (let externalPoi of _externalPoisToSave) {
          let _poiData = this._poiEditorService.getDbObj(externalPoi);
          let _poi = new Poi(<IExternalPoi>_poiData);
          _poisToSave.push(_poi);
        }

        this._store.dispatch(new commonPoiActions.AddGTrackPois(_poisToSave));
      });
  }
}
