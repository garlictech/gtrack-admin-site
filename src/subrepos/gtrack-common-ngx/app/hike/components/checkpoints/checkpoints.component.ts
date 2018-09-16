import { filter } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Component, Input } from '@angular/core';
import { Dictionary } from '@ngrx/entity/src/models';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { faArrowRight, faSortUp, faSortDown, faClock, faTrophy } from '@fortawesome/free-solid-svg-icons';

import { IPoi } from '../../../../../provider-client';
import * as poiActions from '../../store/poi/actions';
import { Checkpoint } from '../../services/checkpoint';
import { PoiSelectors } from '../../store/poi';

@Component({
  selector: 'gtcn-checkpoints',
  template: ''
})
export class CheckpointsComponent {
  public pois$: Observable<Partial<Dictionary<IPoi>>>;
  faArrowRight = faArrowRight;
  faSortUp = faSortUp;
  faSortDown = faSortDown;
  faClock = faClock;
  faTrophy = faTrophy;

  constructor(private _poiSelectors: PoiSelectors, private _store: Store<any>) {}

  @Input()
  public set checkpoints(checkpoints: Checkpoint[]) {
    if (checkpoints instanceof Array) {
      this._checkpoints = checkpoints;

      const poiIds = checkpoints
        .filter(checkpoint => !/^endpoint/.test(checkpoint.id))
        .map(checkpoint => checkpoint.id);

      this.pois$ = this._store
        .pipe(
          select(this._poiSelectors.getPoiEntities(poiIds)),
          filter(pois => !_.isEmpty(pois))
        );

      this._store.dispatch(new poiActions.LoadPois(poiIds));
    }
  }

  public get checkpoints(): Checkpoint[] {
    return this._checkpoints;
  }

  private _checkpoints: Checkpoint[] = [];
}
