import _map from 'lodash-es/map';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { State } from '../../../store';
import { commonPoiActions, editedHikeProgramActions, hikeEditPoiActions } from '../../../store/actions';
import * as hikeEditRoutePlannerSelectors from '../../../store/selectors/hike-edit-route-planner';
import { PoiEditorService } from '../../services';

@Component({
  selector: 'app-marker-popup',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class AdminMarkerPopupComponent implements OnInit {
  // tslint:disable-next-line:no-property-initializers
  static componentName = 'AdminMarkerPopupComponent';
  isPlanning$: Observable<boolean>;
  data: any;
  closePopup: any;

  images: Array<string>;
  btnTitle: string;
  btn2Title: string;
  btnClass: string;
  btn2Class: string;
  btnClick: any;
  btn2Click: any;

  constructor(private readonly _store: Store<State>, private readonly _poiEditorService: PoiEditorService) {
    this.images = [];

    this.isPlanning$ = this._store.pipe(
      select(hikeEditRoutePlannerSelectors.getIsPlanning),
      take(1)
    );

    this.btnTitle = '';
    this.btn2Title = '';
    this.btnClass = '';
    this.btn2Class = '';
  }

  ngOnInit(): void {
    switch (this.data.markerType) {
      case 'hike':
        this.btnTitle = 'Remove from hike';
        this.btnClick = this._removeFromHike;
        this.btnClass = 'warning';
        this.images = _map(this.data.backgroundImages || [], 'card.url');
        break;
      case 'gTrack':
        this.btnTitle = 'Add to hike';
        this.btnClick = this._addToHike;
        this.btnClass = 'success';
        this.images = _map(this.data.backgroundImages || [], 'card.url');
        break;
      case 'collector':
        this.btnTitle = 'Remove from collector';
        this.btnClick = this._removeFromCollector;
        this.btn2Title = 'Add GTrack poi';
        this.btn2Click = this._addToGTrackPoi;
        this.btnClass = 'warning';
        this.btn2Class = 'success';
        this.images = this._getBgImagesUrls();
        break;
      default:
        this.btnTitle = 'Add to collector';
        this.btnClick = this._addToCollector;
        this.btnClass = 'success';
        this.images = this._getBgImagesUrls();
        break;
    }
  }

  private _getBgImagesUrls(): Array<string> {
    if (this.data.google && this.data.google.photos && this.data.google.photos.length > 0) {
      return _map(this.data.google.photos, 'card.url');
    }

    if (this.data.wikipedia && this.data.wikipedia.photos && this.data.wikipedia.photos.length > 0) {
      return _map(this.data.wikipedia.photos, 'original.url');
    }

    return [];
  }

  // tslint:disable-next-line:no-property-initializers
  private readonly _removeFromHike = () => {
    this._store.dispatch(new editedHikeProgramActions.RemoveStopByPoiId([this.data.id]));

    this.closePopup();
  };

  // tslint:disable-next-line:no-property-initializers
  private readonly _addToHike = () => {
    this._store.dispatch(new editedHikeProgramActions.PrepareThenAddStop(this.data));

    this.closePopup();
  };

  // tslint:disable-next-line:no-property-initializers
  private readonly _removeFromCollector = () => {
    this._store.dispatch(new hikeEditPoiActions.RemovePoisFromCollector([this.data.id]));

    this.closePopup();
  };

  // tslint:disable-next-line:no-property-initializers
  private readonly _addToCollector = () => {
    this._store.dispatch(new hikeEditPoiActions.AddPoisToCollector([this.data]));

    this.closePopup();
  };

  // tslint:disable-next-line:no-property-initializers
  private readonly _addToGTrackPoi = () => {
    const _poiData = this._poiEditorService.getDbObj(this.data);
    this._store.dispatch(new commonPoiActions.SavePoi(_poiData));

    this.closePopup();
  };
}
