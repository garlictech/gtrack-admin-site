import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from '../../../store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { HikeEditRoutePlannerSelectors } from '../../../store/selectors';

@Component({
  selector: 'app-image-marker-popup',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class ImageMarkerPopupComponent implements OnInit {
  public static componentName = 'ImageMarkerPopupComponent';
  public isPlanning$: Observable<boolean>;
  public data: any;
  public closePopup: any;

  constructor(
    private _store: Store<State>,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors
  ) {}

  ngOnInit() {
    this.isPlanning$ = this._store
      .pipe(
        select(this._hikeEditRoutePlannerSelectors.getIsPlanning),
        take(1)
      );
  }
}
