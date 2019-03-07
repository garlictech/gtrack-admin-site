import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { TranslateService } from '@ngx-translate/core';
import { cold, hot, Scheduler } from 'jest-marbles';
import { Observable } from 'rxjs';

import { EToastSeverity, GENERIC_UI_PLATFORM_SERVICE } from '../../interfaces';
import * as fromActions from '../actions';
import { Effects } from '../effects';

describe('Friends effect tests', () => {
  let effects: Effects;
  let actions: Observable<any>;
  let platformServiceMock: any;
  let translateServiceMock: any;

  beforeEach(() => {
    platformServiceMock = {
      displayLoader: jest.fn(),
      dismissLoader: jest.fn(),
      displayToast: jest.fn()
    };
    translateServiceMock = { instant: jest.fn().mockImplementation(x => x + 'Translated') };

    TestBed.configureTestingModule({
      providers: [
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: GENERIC_UI_PLATFORM_SERVICE, useValue: platformServiceMock },
        Effects,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(Effects);
  });

  describe('showProgressSpinner effect', () => {
    it('should show the spinner', () => {
      const action = new fromActions.ShowProgressSpinner('foobar');
      actions = hot('--a-', { a: action });
      const expected = cold('--a-', { a: action });
      expect(effects.showProgressSpinner$).toBeObservable(expected);
      Scheduler.get().flush();
      expect(platformServiceMock.displayLoader).toBeCalledWith('foobar');
    });
  });

  describe('hideProgressSpinner effect', () => {
    it('should hide the spinner', () => {
      const action = new fromActions.HideProgressSpinner();
      actions = hot('--a-', { a: action });
      const expected = cold('--a-', { a: action });
      expect(effects.hideProgressSpinner$).toBeObservable(expected);
      Scheduler.get().flush();
      expect(platformServiceMock.dismissLoader).toBeCalled();
    });
  });

  describe('displayToast effect', () => {
    it('should show a toast with explicitly specified values', () => {
      const toastData = {
        severity: EToastSeverity.Success,
        summary: 'fooSummary',
        detail: 'fooDetail'
      };
      const action = new fromActions.DisplayToast(toastData);
      actions = hot('--a-', { a: action });
      const expected = cold('--a-', { a: action });
      expect(effects.displayToast$).toBeObservable(expected);
      Scheduler.get().flush();
      expect(translateServiceMock.instant).toBeCalledWith('fooSummary');
      expect(translateServiceMock.instant).toBeCalledWith('fooDetail');

      expect(platformServiceMock.displayToast).toBeCalledWith({
        severity: EToastSeverity.Success,
        summary: 'fooSummaryTranslated',
        detail: 'fooDetailTranslated'
      });
    });

    it('should show a toast with default values', () => {
      const toastData = { summary: 'fooSummary' };
      const action = new fromActions.DisplayToast(toastData);
      actions = hot('--a-', { a: action });
      const expected = cold('--a-', { a: action });
      expect(effects.displayToast$).toBeObservable(expected);
      Scheduler.get().flush();
      expect(translateServiceMock.instant).toBeCalledWith('fooSummary');

      expect(platformServiceMock.displayToast).toBeCalledWith({
        severity: EToastSeverity.Success,
        summary: 'fooSummaryTranslated',
        detail: undefined
      });
    });
  });
});
