import { Store } from '@ngrx/store';
import { State, adminMapActions } from '../../../store';
import { HikeEditRoutePlannerSelectors } from '../../../store/selectors';
import { Injectable } from '@angular/core';
import { AdminMap } from './lib/admin-map';
import { IconService, MapMarkerService, MapService, MarkerPopupService, DescriptionLanguageListService } from 'subrepos/gtrack-common-ngx/app';

import * as uuid from 'uuid/v1';

@Injectable()
export class AdminMapService extends MapService {
  protected _maps: { [id: string]: AdminMap } = {};

  constructor(
    protected iconService: IconService,
    protected mapMarkerService: MapMarkerService,
    store: Store<State>,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
  protected _descriptionLanguageList: DescriptionLanguageListService,
  protected _markerPopup: MarkerPopupService
  ) {
    // TODO: null-s are introduced to be able to compile, should be checked...
    super(iconService, mapMarkerService, store, null, null, _descriptionLanguageList, _markerPopup);
  }

  public get(leafletMap: L.Map): AdminMap {
    const _id = uuid();
    const _map = new AdminMap(
      _id,
      leafletMap,
      this.iconService,
      this.mapMarkerService,
      this._store,
      this._hikeEditRoutePlannerSelectors,
      this._descriptionLanguageList,
      this._markerPopup
    );
    this._maps[_id] = _map;

    this._store.dispatch(
      new adminMapActions.RegisterMap({
        mapId: _id
      })
    );

    return _map;
  }

  getMapById(id: string) {
    return this._maps[id];
  }
}
