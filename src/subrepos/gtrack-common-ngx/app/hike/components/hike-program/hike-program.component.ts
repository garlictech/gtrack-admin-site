import { of as observableOf, Observable } from 'rxjs';

import { filter } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Component, Input, OnInit } from '@angular/core';

import _isEmpty from 'lodash-es/isEmpty';

import { Dictionary } from '@ngrx/entity/src/models';

import { IPoi, IHikeProgram, IHikeProgramStop } from '../../../../../provider-client';
import { PoiSelectors } from '../../store/poi';
import * as poiActions from '../../store/poi/actions';
import { IconService } from '../../../map/services/icon';

@Component({
  selector: 'gtcn-hike-program',
  template: ''
})
export class HikeProgramComponent implements OnInit {
  @Input()
  public hikeProgram: IHikeProgram;

  public pois$: Observable<Partial<Dictionary<IPoi>>>;
  public startIcon: string;
  public finishIcon: string;
  public activeStop: IHikeProgramStop;

  constructor(private _poiSelectors: PoiSelectors, private _store: Store<any>, icon: IconService) {
    this.startIcon = icon.url('start');
    this.finishIcon = icon.url('finish');
  }

  displayStop(stop: IHikeProgramStop) {
    this.activeStop = stop;
  }

  ngOnInit() {
    const hikePois = this.hikeProgram.stops.filter(stop => !/^endpoint/.test(stop.poiId)).map(stop => stop.poiId);

    if (hikePois.length > 0) {
      this.pois$ = this._store
        .pipe(
          select(this._poiSelectors.getPoiEntities(hikePois)),
          filter(pois => !_isEmpty(pois))
        );
    } else {
      this.pois$ = observableOf({});
    }

    this._store.dispatch(new poiActions.LoadPois(hikePois));
  }
}
