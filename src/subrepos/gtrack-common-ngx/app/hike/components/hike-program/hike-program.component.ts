import { Store } from '@ngrx/store';
import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';

import { IHikeProgram } from '../../services/hike-program';
import { IPoi } from '../../services/poi';
import { PoiSelectors } from '../../store/poi';
import * as poiActions from '../../store/poi/actions';
import { Observable } from 'rxjs/Observable';
import { Dictionary } from '@ngrx/entity/src/models';

@Component({
  selector: 'gtcn-hike-program',
  templateUrl: './hike-program.component.html',
  styleUrls: ['./hike-program.component.scss']
})
export class HikeProgramComponent implements OnInit {
  @Input()
  public hikeProgram: IHikeProgram;

  public pois$: Observable<Partial<Dictionary<IPoi>>>;

  constructor(
    private _poiSelectors: PoiSelectors,
    private _store: Store<any>
  ) {}

  ngOnInit() {
    let hikePois = this.hikeProgram.stops.map(stop => stop.poiId);

    this.pois$ = this._store
      .select(this._poiSelectors.getPoiEntities(hikePois))
      .filter(pois => (!_.isEmpty(pois)));

    this._store.dispatch(new poiActions.LoadPois(hikePois));
  }
}
