import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../store';
import { editedHikeProgramActions, hikeEditPoiActions, commonPoiActions } from '../../../store/actions';
import { Observable } from 'rxjs';
import { HikeEditRoutePlannerSelectors } from '../../../store/selectors';
import { PoiEditorService } from '../../services';

import _map from 'lodash-es/map';

@Component({
  selector: 'app-marker-popup',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class AdminMarkerPopupComponent implements OnInit {
  public static componentName = 'AdminMarkerPopupComponent';
  public isPlanning$: Observable<boolean>;
  public data: any;
  public closePopup: any;

  public images: string[];
  public btnTitle: string;
  public btn2Title: string;
  public btnClass: string;
  public btn2Class: string;
  public btnClick: any;
  public btn2Click: any;

  constructor(
    private _store: Store<State>,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _poiEditorService: PoiEditorService
  ) {}

  ngOnInit() {
    this.isPlanning$ = this._store
      .select(this._hikeEditRoutePlannerSelectors.getIsPlanning)
      .take(1);

    switch (this.data.markerType) {
      case 'hike':
        this.btnTitle = 'Remove from hike';
        this.btnClick = this._removeFromHike;
        this.btnClass = 'warning';
        this.images = _map(this.data.backgroundImages, 'card.url') || [];
        break;
      case 'gTrack':
        this.btnTitle = 'Add to hike';
        this.btnClick = this._addToHike;
        this.btnClass = 'success';
        this.images = _map(this.data.backgroundImages, 'card.url') || [];
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

  private _getBgImagesUrls() {
    if (this.data.google && this.data.google.photos && this.data.google.photos.length > 0) {
      return _map(this.data.google.photos, 'card.url');
    }

    if (this.data.wikipedia && this.data.wikipedia.photos && this.data.wikipedia.photos.length > 0) {
      return _map(this.data.wikipedia.photos, 'original.url');
    }
  }

  private _removeFromHike = () => {
    this._store.dispatch(new editedHikeProgramActions.RemoveStopByPoiId([this.data.id]));

    this.closePopup();
  }

  private _addToHike = () => {
    this._store.dispatch(new editedHikeProgramActions.PrepareThenAddStop(this.data));

    this.closePopup();
  }

  private _removeFromCollector = () => {
    this._store.dispatch(new hikeEditPoiActions.RemovePoisFromCollector([this.data.id]));

    this.closePopup();
  }

  private _addToCollector = () => {
    this._store.dispatch(new hikeEditPoiActions.AddPoisToCollector([this.data]));

    this.closePopup();
  }

  private _addToGTrackPoi = () => {
    let _poiData = this._poiEditorService.getDbObj(this.data);
    this._store.dispatch(new commonPoiActions.SavePoi(_poiData));

    this.closePopup();
  }
}
