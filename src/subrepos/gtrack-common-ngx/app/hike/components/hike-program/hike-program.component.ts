import { Store } from '@ngrx/store';
import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Dictionary } from '@ngrx/entity/src/models';

import { IPoi, IHikeProgram } from 'subrepos/provider-client';
import { PoiSelectors } from '../../store/poi';
import * as poiActions from '../../store/poi/actions';
import { IconService } from '../../../map/services/icon';

@Component({
  selector: 'gtcn-hike-program',
  templateUrl: './hike-program.component.html',
  styleUrls: ['./hike-program.component.scss']
})
export class HikeProgramComponent implements OnInit {
  @Input() public hikeProgram: IHikeProgram;

  public pois$: Observable<Partial<Dictionary<IPoi>>>;
  public startIcon: string;
  public finishIcon: string;

  constructor(private _poiSelectors: PoiSelectors, private _store: Store<any>, icon: IconService) {
    this.startIcon = icon.url('start');
    this.finishIcon = icon.url('finish');
  }

  ngOnInit() {
    let hikePois = this.hikeProgram.stops
      .filter(stop => !/^endpoint/.test(stop.poiId))
      .map(stop => stop.poiId);

    this.pois$ = this._store.select(this._poiSelectors.getPoiEntities(hikePois)).filter(pois => !_.isEmpty(pois));

    this._store.dispatch(new poiActions.LoadPois(hikePois));
  }
}
