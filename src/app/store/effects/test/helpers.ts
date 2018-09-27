import { Observable, EMPTY } from 'rxjs';
import { Actions } from '@ngrx/effects';

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
  navigate: jasmine.createSpy('navigate'),
  url: ''
};
