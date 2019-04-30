import _isEmpty from 'lodash-es/isEmpty';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Component, Input } from '@angular/core';
import { Checkpoint } from '@bit/garlictech.angular-features.common.checkpoints';
import { PoiData } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import {
  faArrowRight,
  faClock,
  faSortDown,
  faSortUp,
  faTrophy,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';
import { Dictionary } from '@ngrx/entity/src/models';
import { select, Store } from '@ngrx/store';

import { PoiSelectors } from '@bit/garlictech.angular-features.common.poi';
import * as poiActions from '@bit/garlictech.angular-features.common.poi/store/actions';

@Component({
  selector: 'gtrack-common-checkpoints',
  template: ''
})
export class CheckpointsComponent {
  @Input()
  set checkpoints(checkpoints: Array<Checkpoint>) {
    if (checkpoints instanceof Array) {
      this._checkpoints = checkpoints;

      const poiIds = checkpoints
        .filter(checkpoint => !/^endpoint/.test(checkpoint.id))
        .map(checkpoint => checkpoint.id);

      this.pois$ = this._store.pipe(
        select(this._poiSelectors.getPoiEntities(poiIds)),
        filter(pois => !_isEmpty(pois))
      );

      this._store.dispatch(new poiActions.LoadPois(poiIds));
    }
  }

  get checkpoints(): Array<Checkpoint> {
    return this._checkpoints;
  }
  pois$: Observable<Partial<Dictionary<PoiData>>>;
  faArrowRight: IconDefinition;
  faSortUp: IconDefinition;
  faSortDown: IconDefinition;
  faClock: IconDefinition;
  faTrophy: IconDefinition;

  private _checkpoints: Array<Checkpoint>;

  constructor(private readonly _poiSelectors: PoiSelectors, private readonly _store: Store<any>) {
    this.faArrowRight = faArrowRight;
    this.faSortUp = faSortUp;
    this.faSortDown = faSortDown;
    this.faClock = faClock;
    this.faTrophy = faTrophy;

    this._checkpoints = [];
  }
}
