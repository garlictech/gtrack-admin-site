import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, hikeEditPoiActions, commonPoiActions } from '../../../../store';
import { IExternalPoi, IFilteredProperties, IGTrackPoi } from '../../../../shared/interfaces';
import { Subject, Observable } from 'rxjs';
import { HikeEditPoiSelectors, HikeEditMapSelectors } from '../../../../store/selectors';
import { PoiEditorService, LanguageService, PoiMergeService } from '../../../../shared/services';
import { AdminMap, AdminMapService } from '../../../../shared/services/admin-map';
import { PoiSelectors } from 'subrepos/gtrack-common-ngx';

import * as _ from 'lodash';
import * as uuid from 'uuid/v1';

@Component({
  selector: 'gt-hike-edit-pois-collector',
  templateUrl: './ui.html'
})
export class HikeEditPoisCollectorComponent implements OnInit, OnDestroy {
  public pois$: Observable<any[]>;
  public selectedPois$: Observable<any[]>;
  public showOnrouteMarkers = true;
  public showOffrouteMarkers = true;
  public modalPoi: any;
  public displayPoiModal = false;
  public mergeSelectionCount$: Observable<number>;
  public mergeProperties: IFilteredProperties = {};
  public mergedPoiIds: string[] = [];
  public mergedPoiData: any;
  public displayMergeModal = false;
  private _map: AdminMap;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _hikeEditPoiSelectors: HikeEditPoiSelectors,
    private _hikeEditMapSelectors: HikeEditMapSelectors,
    private _poiSelectors: PoiSelectors,
    private _poiEditorService: PoiEditorService,
    private _poiMergeService: PoiMergeService,
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

    // Poi list from store
    this.pois$ = this._store.select(this._hikeEditPoiSelectors.getAllCollectorPois);
    this.selectedPois$ = this._store.select(this._hikeEditPoiSelectors.getSelectedCollectorPois());

    this.mergeSelectionCount$ = this._store
      .select(this._hikeEditPoiSelectors.getMergeSelectionsCount)
      .takeUntil(this._destroy$);

    // Update inGtrackDb properties after common poi list has been refreshed
    this._store
      .select(this._poiSelectors.getAllPois)
      .debounceTime(200)
      .filter((gTrackPois: IGTrackPoi[]) => gTrackPois.length > 0)
      .takeUntil(this._destroy$)
      .subscribe((gTrackPois: IGTrackPoi[]) => {
        this._store.select(this._hikeEditPoiSelectors.getAllCollectorPois)
          .filter((collectedPois: any[]) => collectedPois.length > 0)
          .take(1)
          .subscribe((collectedPois: any[]) => {
            const _checkedCollectorPois: any[] = this._poiEditorService.handleGTrackPois(collectedPois, gTrackPois);
            const _removablePoiIds = _.map(_checkedCollectorPois.filter(p => p.inGtrackDb), 'id');
            this._store.dispatch(new hikeEditPoiActions.RemovePoisFromCollector(_removablePoiIds));
          });
      });

    //
    // Refresh markers
    //

    this._store
      .select(this._hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector('collector', 'showOnrouteMarkers'))
      .takeUntil(this._destroy$)
      .subscribe((value: boolean) => {
        this.showOnrouteMarkers = value;
        this._poiEditorService.refreshPoiMarkers(this._map);
      });

    this._store
      .select(this._hikeEditPoiSelectors.getHikeEditPoiContextPropertySelector('collector', 'showOffrouteMarkers'))
      .takeUntil(this._destroy$)
      .subscribe((value: boolean) => {
        this.showOffrouteMarkers = value;
        this._poiEditorService.refreshPoiMarkers(this._map);
      });
  }

  ngOnDestroy() {
    //
  }

  /**
   * Show onroute markers checkbox click
   */
  public toggleOnrouteMarkers() {
    this._store.dispatch(new hikeEditPoiActions.ToggleOnrouteMarkers('collector'));
  }

  /**
   * Show offroute markers checkbox click
   */
  public toggleOffrouteMarkers() {
    this._store.dispatch(new hikeEditPoiActions.ToggleOffrouteMarkers('collector'));
  }

  /**
   * Start merge
   */
  public mergePois() {
    this._store
      .select(this._hikeEditPoiSelectors.getMergeSelections)
      .take(1)
      .subscribe((selections: string[]) => {
        Observable
          .combineLatest(...selections.map(poiId => this._store.select(this._hikeEditPoiSelectors.getCollectorPoi(poiId)).take(1)))
          .take(1)
          .subscribe(pois => {
            this.mergeProperties = this._poiMergeService.collectFlatKeyValues(pois);
            this.mergedPoiIds = _.map(pois, 'id');
            this.mergedPoiData = this._poiMergeService.createGTrackPoiFromUniqueValues(this.mergeProperties.unique);

            this._store.dispatch(new hikeEditPoiActions.ResetPoiMergeSelection());

            if (_.keys(this.mergeProperties.conflicts).length > 0) {
              this.displayMergeModal = true;
            } else {
              this._saveMergedPoiData();
            }
          });
      });
  }

  /**
   * Merge modal callback
   */
  public saveMergedPoi = (mergedData) => {
    const _coordsArr = mergedData.coords.slice(1, -1).split(',');

    this.mergedPoiData.lat = parseFloat(_coordsArr[0]);
    this.mergedPoiData.lon = parseFloat(_coordsArr[1]);
    if (_coordsArr[2]) {
      this.mergedPoiData.elevation = parseFloat(_coordsArr[2]);
    }
    delete this.mergedPoiData.coords;

    for (const key in mergedData) {
      _.set(this.mergedPoiData, key, mergedData[key]);
    }

    this.displayMergeModal = false;

    this._saveMergedPoiData();
  }

  /**
   * Save the new merged poi and remove merge sources
   */
  private _saveMergedPoiData() {
    this.mergedPoiData.id = uuid();
    this.mergedPoiData.objectType = this.mergedPoiData.objectTypes.join(', ');
    delete this.mergedPoiData.objectTypes;

    this._store.dispatch(new hikeEditPoiActions.AddPoisToCollector([this.mergedPoiData]));
    this._store.dispatch(new hikeEditPoiActions.RemovePoisFromCollector(this.mergedPoiIds));
  }

  /**
   * Save selected pois as gTrackPoi
   */
  public savePois() {
    this._store.dispatch(new hikeEditPoiActions.SetSaving('collector', true));

    this.pois$
      .take(1)
      .subscribe((pois: IExternalPoi[]) => {
        const _externalPoisToSave = _.filter(pois, (poi: IExternalPoi) => {
          return (!!(poi.selected && !poi.inGtrackDb));
        });

        for (let externalPoi of _externalPoisToSave) {
          let _poiData = this._poiEditorService.getDbObj(externalPoi);
          this._store.dispatch(new commonPoiActions.SavePoi(_poiData));
        }
      });
  }

  /**
   * Remove selected pois from the collector
   */
  public removeSelectedPois() {
    this.selectedPois$
      .take(1)
      .subscribe((selectedPois: any[]) => {
        const _removablePoiIds = _.map(selectedPois, 'id');
        this._store.dispatch(new hikeEditPoiActions.RemovePoisFromCollector(_removablePoiIds));
      });
  }

  public translateDescription(description, field) {
    return LanguageService.translateDescription(description, field);
  }

  public openPoiModal = (poi) => {
    this.modalPoi = _.cloneDeep(poi);
    this.displayPoiModal = true;
  }
}
