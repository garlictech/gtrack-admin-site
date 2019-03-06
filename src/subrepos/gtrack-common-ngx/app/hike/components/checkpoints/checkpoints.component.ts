import { Component, Input } from '@angular/core';
import { PoiData } from '@features/common/gtrack-interfaces';
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
import _isEmpty from 'lodash-es/isEmpty';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Checkpoint } from '../../services/checkpoint';
import { PoiSelectors } from '../../store/poi';
import * as poiActions from '../../store/poi/actions';

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
