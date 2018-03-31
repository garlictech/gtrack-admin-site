
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import {
   PoiSelectors, CenterRadius, GeometryService, GeoSearchSelectors, Poi, PoiSaved, IGeoSearchContextState
} from 'subrepos/gtrack-common-ngx';
import { IPoiStored, IPoi } from 'subrepos/provider-client';
import { AdminMap, AdminMapService, AdminMapMarker } from 'app/shared/services/admin-map';
import { PoiEditorService } from 'app/shared/services';
import { IGTrackPoi } from 'app/shared/interfaces';
import {
  State, hikeEditPoiActions, IExternalPoiListContextState, commonPoiActions, commonGeoSearchActions, hikeEditGeneralInfoActions, IHikeEditRoutePlannerState,
} from 'app/store';
import {
  HikeEditPoiSelectors, HikeEditMapSelectors, HikeEditGeneralInfoSelectors, HikeEditRoutePlannerSelectors
} from 'app/store/selectors';

import * as _ from 'lodash';
import * as uuid from 'uuid/v1';

@Component({
  selector: 'gt-hike-edit-pois-hike',
  templateUrl: './hike-edit-pois-hike.component.html'
})
export class HikeEditPoisHikeComponent implements OnInit, OnDestroy {
  public pois$: Observable<IGTrackPoi[]>;
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
    private _hikeEditGeneralInfoSelectors: HikeEditGeneralInfoSelectors,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _geoSearchSelectors: GeoSearchSelectors,
    private _geometryService: GeometryService,
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
    this._store
      .select(this._hikeEditGeneralInfoSelectors.getPois)
      .takeUntil(this._destroy$)
      .subscribe((poiIds) => {
        console.log('POIS', poiIds);
        if (poiIds) {
          this._store.dispatch(new commonPoiActions.LoadPois(poiIds));
        }
      });

    // Poi list based on geoSearch results
    this.pois$ = this._store
      .select(this._hikeEditGeneralInfoSelectors.getHikePois<(IPoi)>(this._poiSelectors.getAllPois))
      .switchMap((pois: Poi[]) => this._poiEditorService.organizePois(_.cloneDeep(pois), this._map.routeInfo.getPath()))

    this.pois$
      .takeUntil(this._destroy$)
      .subscribe((pois: Poi[]) => {
        // Refresh markers
        console.log('TODO: refresh poi markers', pois);
        this._poiEditorService.refreshPoiMarkers(this._map);
      });

    //
    // Contexts
    //

    this.showOnrouteMarkers$ = this._store
      .select(this._hikeEditPoiSelectors.getHikeEditContextPropertySelector('gTrack', 'showOnrouteMarkers'));

    this.showOffrouteMarkers$ = this._store
      .select(this._hikeEditPoiSelectors.getHikeEditContextPropertySelector('gTrack', 'showOffrouteMarkers'));

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
    this._store.dispatch(
      new hikeEditPoiActions.ToggleOnrouteMarkers({ subdomain: 'gTrack' })
    );
  }

  /**
   * Show offroute markers checkbox click
   */
  public toggleOffrouteMarkers() {
    this._store.dispatch(
      new hikeEditPoiActions.ToggleOffrouteMarkers({ subdomain: 'gTrack' })
    );
  }

  /**
   * Save inHike pois as gTrackPoi
   */
  public savePois() {
    Observable.combineLatest(
      // gTrack pois from the store
      this.pois$.take(1),
      // poi ids from the loaded hike program
      this._store.select(this._hikeEditGeneralInfoSelectors.getPois).take(1)
    ).subscribe(data => {
      if (data[0] && data[1]) {
        const _gTrackPois = _.filter(data[0], (p: IGTrackPoi) => true /* p.inHike */)
          .map((p: IGTrackPoi) => p.id);

        this._store.dispatch(new hikeEditGeneralInfoActions.SetPois({
          pois: _.union(<string[]>_gTrackPois, data[1])
        }));
      }
    });
  }
}