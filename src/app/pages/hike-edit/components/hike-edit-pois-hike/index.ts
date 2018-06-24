import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { PoiSelectors, GeoSearchSelectors, Poi } from 'subrepos/gtrack-common-ngx';
import { IPoiStored, IPoi, IHikeProgramStop } from 'subrepos/provider-client';
import { AdminMap, AdminMapService, AdminMapMarker } from 'app/shared/services/admin-map';
import { PoiEditorService, HikeProgramService } from 'app/shared/services';
import { IGTrackPoi } from 'app/shared/interfaces';
import { State, hikeEditPoiActions, commonPoiActions, editedHikeProgramActions } from 'app/store';
import {
  HikeEditPoiSelectors, HikeEditMapSelectors, HikeEditRoutePlannerSelectors, EditedHikeProgramSelectors
} from 'app/store/selectors';

import * as _ from 'lodash';

@Component({
  selector: 'gt-hike-edit-pois-hike',
  templateUrl: './ui.html'
})
export class HikeEditPoisHikeComponent implements OnInit, OnDestroy {
  public pois$: Observable<IGTrackPoi[]>;
  public showOnrouteMarkers = true;
  public showOffrouteMarkers = true;
  public displayGTrackPoiModal = false;
  public modalPoiId: string;
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
    private _hikeProgramService: HikeProgramService,
    private _poiSelectors: PoiSelectors
  ) {}

  ngOnInit() {
    this._store
      .select(this._hikeEditMapSelectors.getMapId)
      .filter(id => id !== '')
      .takeUntil(this._destroy$)
      .subscribe((mapId: string) => {
        this._map = this._adminMapService.getMapById(mapId);
      });

    // Get pois by id
    Observable
      .combineLatest(
        this._store.select(this._editedHikeProgramSelectors.getPoiIds).takeUntil(this._destroy$),
        this._store.select(this._poiSelectors.getPoiIds).takeUntil(this._destroy$)
      )
      .debounceTime(200)
      .takeUntil(this._destroy$)
      .subscribe(([inHikePoiIds, inStorePoiIds]: [string[], string[]]) => {
        const missingPoiIds = _.difference(inHikePoiIds, _.intersection(inHikePoiIds, inStorePoiIds)).filter(id => id !== 'endpoint');

        // Get only the not-loaded pois
        if (missingPoiIds && missingPoiIds.length > 0) {
          this._store.dispatch(new commonPoiActions.LoadPois(missingPoiIds));
        }
      });

    // Poi list
    this.pois$ = this._store
      .select(this._editedHikeProgramSelectors.getHikePois<IPoiStored>(this._poiSelectors.getAllPois))
      .debounceTime(200)
      .takeUntil(this._destroy$)
      .filter((pois: IPoiStored[]) => typeof pois !== 'undefined')
      .switchMap((pois: IPoiStored[]) => {
        return this._store
          .select(this._hikeEditRoutePlannerSelectors.getPath)
          .filter((path: any) => path && path.geometry.coordinates.length > 0)
          .takeUntil(this._destroy$)
          .map((path: any) => {
            const organizedPois = this._poiEditorService.organizePois(pois, path);
            const poiIds = _.map(pois, 'id');
            const organizedPoiIds = _.map(organizedPois, 'id');
            const removablePoiIds = _.difference(poiIds, _.intersection(poiIds, organizedPoiIds))

            if (removablePoiIds.length > 0) {
              this._store.dispatch(new editedHikeProgramActions.RemoveStopByPoiId(removablePoiIds));
            }

            return organizedPois;
          });
      });

    this.pois$
      .debounceTime(200)
      .takeUntil(this._destroy$)
      .subscribe((pois: IGTrackPoi[]) => {
        // Refresh markers
        this._poiEditorService.refreshPoiMarkers(this._map);
      });

    this._store
      .select(this._editedHikeProgramSelectors.getStopsCount)
      .takeUntil(this._destroy$)
      .subscribe((stopsCount: number) => {
        this._hikeProgramService.updateHikeProgramStops();
      });

    this._store
      .select(this._hikeEditRoutePlannerSelectors.getPathLength)
      .takeUntil(this._destroy$)
      .subscribe((pathLength: number) => {
        this._hikeProgramService.updateHikeProgramStops();
      });

    //
    // Contexts & Refresh markers
    //

    this._store
      .select(this._hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector('hike', 'showOnrouteMarkers'))
      .takeUntil(this._destroy$)
      .subscribe((value: boolean) => {
        this.showOnrouteMarkers = value;
        this._poiEditorService.refreshPoiMarkers(this._map);
      });

    this._store
      .select(this._hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector('hike', 'showOffrouteMarkers'))
      .takeUntil(this._destroy$)
      .subscribe((value: boolean) => {
        this.showOffrouteMarkers = value;
        this._poiEditorService.refreshPoiMarkers(this._map);
      });
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  /**
   * Show onroute markers checkbox click
   */
  public toggleOnrouteMarkers() {
    this._store.dispatch(new hikeEditPoiActions.ToggleOnrouteMarkers('hike'));
  }

  /**
   * Show offroute markers checkbox click
   */
  public toggleOffrouteMarkers() {
    this._store.dispatch(new hikeEditPoiActions.ToggleOffrouteMarkers('hike'));
  }

  public openGTrackPoiModal = (poiId: string) => {
    this.modalPoiId = poiId;
    this.displayGTrackPoiModal = true;
  }
}
