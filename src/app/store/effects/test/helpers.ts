import { Observable, EMPTY } from 'rxjs';
import { Actions } from '@ngrx/effects';

import { pois as poiFixtures } from '../../reducer/test/fixtures';

export class TestActions extends Actions {
  constructor() {
    super(EMPTY);
  }

  set stream(source: Observable<any>) {
    this.source = source;
  }
}

export function getActions() {
  return new TestActions();
}

export const mockRouter = {
  url: '/login'
};
