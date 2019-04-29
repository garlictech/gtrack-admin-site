import { Component, Input } from '@angular/core';
import { HikeProgramData } from '@features/common/gtrack-interfaces';
import { Store } from '@ngrx/store';
import * as actions from '../../store/actions';

@Component({
  selector: 'gtrack-common-reverse-hike-button',
  template: ''
})
export class ReverseHikeButtonComponent {
  @Input() hikeProgram: HikeProgramData;

  reverse(): void {
    if (this.hikeProgram && this.hikeProgram.id) {
      this._store.dispatch(new actions.ReverseHikeProgram(this.hikeProgram.id));
    }
  }

  constructor(private readonly _store: Store<any>) {}
}
